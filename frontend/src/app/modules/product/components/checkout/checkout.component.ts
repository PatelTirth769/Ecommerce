import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { PaymentService } from 'src/app/core/services/payment.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { environment } from 'src/environments/environment';

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
  grandTotal: number = 0;
  shippingForm!: FormGroup;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private toastService: ToastService,
    private router: Router,
    private formBuilder: FormBuilder
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
        this.shippingForm.patchValue({
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || '',
          mobile: user.mobile_no || ''
        });
      } catch (e) {
        console.warn('Failed to parse stored user info for checkout form prefill', e);
      }
    }
    this.getTotal();
  }

  getTotal(): void {
    // Manually calculate 18% GST on the subtotal (total)
    this.cartService.totalAmount.subscribe(data => {
      this.total = Number(data.toFixed(2));
      this.gstAmount = Number((this.total * 0.18).toFixed(2));
      this.updateGrandTotal();
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

    // Call backend to create Razorpay Order
    this.paymentService.createOrder(this.grandTotal).subscribe({
      next: (res) => {
        const options: any = {
          key: environment.razorpayKey,
          amount: res.amount,
          currency: res.currency,
          name: '24x7 Shop',
          description: 'E-commerce Checkout Purchase',
          order_id: res.id,
          handler: (response: any) => {
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
    this.toastService.showInfo('Verifying payment signature...');

    const verificationData = {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature
    };

    // Verify payment in backend
    this.paymentService.verifyPayment(verificationData).subscribe({
      next: (verifyRes) => {
        if (verifyRes && verifyRes.success) {
          // Payment successfully verified. Now save order to Firestore
          const orderData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            email: this.shippingForm.value.email,
            shippingAddress: { ...this.shippingForm.value },
            items: this.cartService.getCart.map(item => ({
              title: item.title,
              item_code: item.item_code,
              qty: item.qty,
              price: item.price,
              totalprice: item.totalprice,
              image: item.images?.[0] || ''
            })),
            subtotal: this.total,
            tax: this.gstAmount,
            shippingCost: this.shippingCost,
            discount: this.discountAmount,
            totalAmount: this.grandTotal,
            status: 'Paid'
          };

          this.paymentService.saveOrder(orderData).subscribe({
            next: () => {
              this.toastService.showSuccess('Payment Successful and Order Placed!');
              this.cartService.clearCart();
              this.router.navigate(['/buyer-profile']);
            },
            error: (saveErr) => {
              console.error('Failed to save order details:', saveErr);
              // Order is paid but firestore save failed. We still redirect but warn the user.
              this.toastService.showWarning('Payment succeeded, but order logging failed. Please contact support.');
              this.cartService.clearCart();
              this.router.navigate(['/buyer-profile']);
            }
          });
        } else {
          this.toastService.showError('Payment verification failed.');
        }
      },
      error: (verifyErr) => {
        console.error('Payment verification request failed:', verifyErr);
        this.toastService.showError('Payment verification failed. Please contact support.');
      }
    });
  }
}

