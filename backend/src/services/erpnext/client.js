const axios = require('axios');
const erpnextConfig = require('../../config/erpnext.config');
const logger = require('../../utils/logger');

// NOTE: This client talks to ERPNext directly via its REST/RPC APIs using a
// dedicated server-side integration API key. It intentionally does NOT use
// ERPNext's built-in Payment Request / payment gateway flow
// (erpnext.accounts.doctype.payment_request.payment_request.make_payment_request) —
// payments are collected through our own Razorpay account/keys, and this
// client is only used AFTER a payment is verified, to create the same
// Sales Order -> Sales Invoice -> Payment Entry document chain ERPNext's own
// webshop checkout would have produced.

const http = axios.create({
  baseURL: erpnextConfig.baseUrl,
  timeout: 15000,
  headers: {
    Authorization: `token ${erpnextConfig.apiKey}:${erpnextConfig.apiSecret}`
  }
});

http.interceptors.request.use((config) => {
  config.metadata = { start: Date.now() };
  return config;
});

http.interceptors.response.use(
  (response) => {
    const durationMs = Date.now() - (response.config.metadata?.start || Date.now());
    logger.info(`ERPNext ${response.config.method?.toUpperCase()} ${response.config.url}`, { durationMs, status: response.status });
    return response;
  },
  (error) => {
    const config = error.config || {};
    const durationMs = Date.now() - (config.metadata?.start || Date.now());
    logger.error(`ERPNext call failed: ${config.method?.toUpperCase()} ${config.url}`, {
      durationMs,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

async function getResource(doctype, name, params) {
  const res = await http.get(`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`, { params });
  return res.data.data;
}

async function listResource(doctype, params) {
  const res = await http.get(`/api/resource/${encodeURIComponent(doctype)}`, { params });
  return res.data.data;
}

async function createResource(doctype, data) {
  const res = await http.post(`/api/resource/${encodeURIComponent(doctype)}`, data);
  return res.data.data;
}

async function updateResource(doctype, name, data) {
  const res = await http.put(`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`, data);
  return res.data.data;
}

async function callGetMethod(dottedMethodPath, params) {
  const res = await http.get(`/api/method/${dottedMethodPath}`, { params });
  return res.data.message;
}

async function callPostMethod(dottedMethodPath, body) {
  const res = await http.post(`/api/method/${dottedMethodPath}`, body);
  return res.data.message;
}

async function submitDoc(doc) {
  const res = await http.post('/api/method/frappe.client.submit', { doc: JSON.stringify(doc) });
  return res.data.message;
}

async function downloadPdf(doctype, name, params) {
  const res = await http.get('/api/method/frappe.utils.print_format.download_pdf', {
    params: { doctype, name, ...params },
    responseType: 'arraybuffer'
  });
  return Buffer.from(res.data);
}

module.exports = {
  http,
  getResource,
  listResource,
  createResource,
  updateResource,
  callGetMethod,
  callPostMethod,
  submitDoc,
  downloadPdf
};
