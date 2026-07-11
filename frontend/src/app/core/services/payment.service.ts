import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(
    private http: HttpClient
  ) {}

  private apiBase = environment.nodeBackendUrl || '';

  // Request backend to create a Razorpay order
  createOrder(amount: number): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/api/payment/create-order`, { amount });
  }

  verifyPayment(verificationData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/api/payment/verify`, verificationData);
  }

  // Save successfully placed order to Backend API
  saveOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/api/orders`, orderData);
  }

  // Fetch orders list for a specific buyer email
  getUserOrders(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBase}/api/orders/${email}`);
  }
}
