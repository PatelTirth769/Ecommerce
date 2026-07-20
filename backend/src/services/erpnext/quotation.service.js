const client = require('./client');
const logger = require('../../utils/logger');

async function getQuotation(name) {
  return client.getResource('Quotation', name);
}

async function getSellingDefaults() {
  try {
    const settings = await client.getResource('Selling Settings', 'Selling Settings');
    return {
      customerGroup: settings.customer_group || 'All Customer Groups',
      territory: settings.territory || 'All Territories'
    };
  } catch (err) {
    logger.warn('Could not read Selling Settings, falling back to root defaults', { message: err.message });
    return { customerGroup: 'All Customer Groups', territory: 'All Territories' };
  }
}

async function findCustomerByEmail(buyerEmail) {
  const contacts = await client.listResource('Contact', {
    filters: JSON.stringify([['email_id', '=', buyerEmail]]),
    fields: JSON.stringify(['name']),
    limit_page_length: 1
  });

  if (!contacts || contacts.length === 0) {
    return null;
  }

  const contact = await client.getResource('Contact', contacts[0].name);
  const customerLink = (contact.links || []).find((link) => link.link_doctype === 'Customer');
  return customerLink ? customerLink.link_name : null;
}

async function createCustomerForBuyer(buyerEmail, shippingForm) {
  const { customerGroup, territory } = await getSellingDefaults();
  const displayName = [shippingForm?.firstName, shippingForm?.lastName].filter(Boolean).join(' ').trim() || buyerEmail;

  const customer = await client.createResource('Customer', {
    customer_name: displayName,
    customer_type: 'Individual',
    customer_group: customerGroup,
    territory
  });

  await client.createResource('Contact', {
    first_name: shippingForm?.firstName || displayName,
    last_name: shippingForm?.lastName || undefined,
    email_ids: [{ email_id: buyerEmail, is_primary_email: 1 }],
    phone_nos: shippingForm?.mobile ? [{ phone: shippingForm.mobile, is_primary_phone: 1 }] : [],
    links: [{ link_doctype: 'Customer', link_name: customer.name }]
  });

  return customer.name;
}

/**
 * The Quotation created by the buyer-portal cart flow only sets
 * order_type/docstatus/items/contact_email (see frontend cart.service.ts) -
 * it never sets party_name/customer, unlike ERPNext's own webshop cart RPCs.
 * This must run before make_sales_order or ERPNext will reject the mapper call.
 */
async function ensureQuotationHasCustomer(quotationName, buyerEmail, shippingForm) {
  const quotation = await getQuotation(quotationName);

  if (quotation.party_name) {
    return { customerName: quotation.party_name, alreadySet: true };
  }

  if (!buyerEmail) {
    throw new Error(`Quotation ${quotationName} has no party_name and no buyer email was provided to resolve one`);
  }

  let customerName = await findCustomerByEmail(buyerEmail);
  if (!customerName) {
    customerName = await createCustomerForBuyer(buyerEmail, shippingForm);
  }

  await client.updateResource('Quotation', quotationName, {
    quotation_to: 'Customer',
    party_name: customerName,
    customer_name: customerName,
    contact_email: buyerEmail
  });

  return { customerName, alreadySet: false };
}

/**
 * quotation.make_sales_order (the mapper this sync relies on) refuses to run
 * unless the source Quotation is already submitted (docstatus=1). The cart
 * keeps Quotations as Drafts until checkout, so this sync submits it here -
 * idempotent, no-ops if already submitted.
 */
async function submitQuotation(quotationName) {
  const quotation = await getQuotation(quotationName);
  if (quotation.docstatus === 1) {
    return quotation;
  }
  return client.submitDoc(quotation);
}

module.exports = {
  getQuotation,
  ensureQuotationHasCustomer,
  submitQuotation
};
