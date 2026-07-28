import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, TaxDetail } from 'src/app/core/services/cart.service';
import { PaymentService } from 'src/app/core/services/payment.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { environment } from 'src/environments/environment';
import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styles: []
})
export class CheckoutComponent implements OnInit {
  total: number = 0;
  gstAmount: number = 0;
  shippingCost: number = 0;
  discountAmount: number = 0;
  taxDescription: string = 'Taxes';
  appliedTaxes: TaxDetail[] = [];
  grandTotal: number = 0;
  shippingForm!: FormGroup;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private toastService: ToastService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: FirebaseAuthService
  ) {
    this.shippingForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
      lastName: new FormControl('', [Validators.minLength(3), Validators.maxLength(15)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('India', [Validators.required]),
      postalCode: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    // Prefill form if user is already logged in
    const storedUser = localStorage.getItem('erpnext_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const email = user.email || '';
        this.shippingForm.patchValue({
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: email,
          mobile: user.mobile_no || ''
        });
        
        if (email) {
          this.authService.getCustomerByEmail(email).subscribe({
            next: (customerName) => {
              if (customerName) {
                this.authService.getCustomerAddresses(customerName).subscribe(addresses => {
                  if (addresses && addresses.length > 0) {
                    // Try to find shipping address, otherwise primary billing, otherwise first
                    let targetAddr = addresses.find(a => a.is_shipping_address) 
                                  || addresses.find(a => a.is_primary_address) 
                                  || addresses[0];
                    
                    this.shippingForm.patchValue({
                      address: targetAddr.address_line1 + (targetAddr.address_line2 ? ', ' + targetAddr.address_line2 : ''),
                      city: targetAddr.city || '',
                      state: targetAddr.state || '',
                      country: targetAddr.country || 'India',
                      postalCode: targetAddr.pincode || '',
                      mobile: targetAddr.phone || this.shippingForm.value.mobile
                    });
                  }
                });
              }
            },
            error: (err) => console.error('Failed to get customer for checkout prefill', err)
          });
        }
      } catch (e) {
        console.warn('Failed to parse stored user info for checkout form prefill', e);
      }
    }
    this.getTotal();
  }

  getTotal(): void {
    this.cartService.totalAmount.subscribe(data => {
      this.total = Number(data.toFixed(2));
      this.updateGrandTotal();
    });
    this.cartService.gstAmount.subscribe(data => {
      this.gstAmount = Number(data.toFixed(2));
      this.updateGrandTotal();
    });
    this.cartService.taxDescription.subscribe(data => {
      this.taxDescription = data;
    });
    this.cartService.appliedTaxes.subscribe(data => {
      this.appliedTaxes = data;
    });
    this.cartService.shippingAmount.subscribe(data => {
      this.shippingCost = Number(data.toFixed(2));
      this.updateGrandTotal();
    });
    this.cartService.discountAmount.subscribe(data => {
      this.discountAmount = Number(data.toFixed(2));
      this.updateGrandTotal();
    });
  }

  updateGrandTotal(): void {
    this.grandTotal = Number((this.total + this.gstAmount + this.shippingCost - this.discountAmount).toFixed(2));
  }

  get firstName() { return this.shippingForm.get('firstName'); }
  get lastName() { return this.shippingForm.get('lastName'); }
  get email() { return this.shippingForm.get('email'); }
  get mobile() { return this.shippingForm.get('mobile'); }
  get address() { return this.shippingForm.get('address'); }
  get state() { return this.shippingForm.get('state'); }
  get city() { return this.shippingForm.get('city'); }
  get country() { return this.shippingForm.get('country'); }
  get postalCode() { return this.shippingForm.get('postalCode'); }

  initiatePayment(): void {
    if (this.shippingForm.invalid) {
      this.toastService.showError('Please fill in all required billing details');
      return;
    }

    if (this.grandTotal <= 0) {
      this.toastService.showError('Your cart is empty');
      return;
    }

    this.toastService.showInfo('Initializing secure payment gateway...');

    const orderMeta = {
      buyer_email: this.shippingForm.value.email,
      quotation_name: this.cartService.getCurrentQuotationName(),
      shipping_form: { ...this.shippingForm.value },
      items: this.cartService.getCart.map(item => ({
        title: item.title,
        item_code: item.item_code,
        qty: item.qty,
        price: item.price
      }))
    };

    console.log('%c[1/6] Checkout started - POST /api/payment/create-order', 'color:#3c64a9;font-weight:bold', { grandTotal: this.grandTotal, orderMeta });

    // Call backend to create Razorpay Order
    this.paymentService.createOrder(this.grandTotal, orderMeta).subscribe({
      next: (res) => {
        console.log('%c[1/6] Razorpay order created', 'color:#3c64a9;font-weight:bold', res);
        const options: any = {
          key: environment.razorpayKey,
          amount: res.amount,
          currency: res.currency,
          name: '24x7 Shop',
          description: 'E-commerce Checkout Purchase',
          order_id: res.id,
          handler: (response: any) => {
            console.log('%c[2/6] Razorpay checkout popup succeeded', 'color:#22863a;font-weight:bold', response);
            this.verifyAndCompletePayment(response);
          },
          prefill: {
            name: `${this.shippingForm.value.firstName} ${this.shippingForm.value.lastName || ''}`,
            email: this.shippingForm.value.email,
            contact: this.shippingForm.value.mobile
          },
          theme: {
            color: '#3c64a9'
          },
          modal: {
            ondismiss: () => {
              this.toastService.showWarning('Payment cancelled by user');
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      },
      error: (err) => {
        console.error('Failed to create payment order:', err);
        this.toastService.showError('Could not initialize payment. Please try again.');
      }
    });
  }

  verifyAndCompletePayment(response: any): void {
    this.toastService.showInfo('Verifying payment and finalizing your order...');

    const verificationData = {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature
    };

    console.log('%c[3/6] POST /api/payment/complete - verifying signature + starting ERPNext sync', 'color:#3c64a9;font-weight:bold', verificationData);

    // Backend verifies the signature, then drives the ERPNext
    // Sales Order -> Sales Invoice -> Payment Entry sync. Order contents are
    // derived server-side from ERPNext, not from this client payload.
    this.paymentService.completePayment(verificationData).subscribe({
      next: (result) => {
        console.log('%c[4/6] /api/payment/complete response', 'color:#3c64a9;font-weight:bold', result);
        if (result && result.success) {
          console.log(`%c[5/6] syncStatus = "${result.syncStatus}"`, 'color:#3c64a9;font-weight:bold', result.erpnext || '(sync still running server-side, confirmation page will poll)');
          this.toastService.showSuccess('Payment Successful!');
          this.cartService.clearCart();
          console.log('%c[6/6] Navigating to order-confirmation page', 'color:#3c64a9;font-weight:bold', response.razorpay_order_id);
          this.router.navigate(['/order-confirmation', response.razorpay_order_id]);
        } else {
          console.error('[complete] Payment verification failed', result);
          this.toastService.showError('Payment verification failed.');
        }
      },
      error: (err) => {
        console.error('[complete] Payment completion request failed:', err);
        this.toastService.showError('Payment verification failed. Please contact support.');
      }
    });
  }
}

