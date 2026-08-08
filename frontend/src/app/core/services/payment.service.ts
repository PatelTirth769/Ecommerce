import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CreateOrderMeta {
  buyer_email?: string;
  quotation_name?: string | null;
  shipping_form?: any;
  items?: any[];
}

export interface CompletePaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PlaceCodOrderRequest {
  amount: number;
  buyer_email?: string;
  quotation_name?: string | null;
  shipping_form?: any;
  items?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(
    private http: HttpClient
  ) {}

  private apiBase = environment.nodeBackendUrl || '';

  // Request backend to create a Razorpay order (also opens a Firestore payment record)
  createOrder(amount: number, meta?: CreateOrderMeta): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/api/payment/create-order`, { amount, ...meta });
  }

  // Verifies the payment signature, then runs (or resumes) the idempotent
  // ERPNext Sales Order -> Sales Invoice -> Payment Entry sync.
  completePayment(data: CompletePaymentRequest): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/api/payment/complete`, data);
  }

  getPaymentStatus(razorpayOrderId: string): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/api/payment/status/${razorpayOrderId}`);
  }

  getInvoiceDownloadUrl(razorpayOrderId: string): string {
    return `${this.apiBase}/api/payment/invoice/${razorpayOrderId}`;
  }

  getPaymentEntryDownloadUrl(razorpayOrderId: string): string {
    return `${this.apiBase}/api/payment/payment-entry/${razorpayOrderId}`;
  }

  // Fetch orders list for a specific buyer email
  getUserOrders(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/api/orders/${email}`);
  }

  // Cash on Delivery: no payment gateway step, creates the Sales Order
  // synchronously server-side in one call.
  placeCodOrder(data: PlaceCodOrderRequest): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/api/orders/cod`, data);
  }
}
