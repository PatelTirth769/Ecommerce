import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore
  ) {}

  // Request backend to create a Razorpay order
  createOrder(amount: number): Observable<any> {
    return this.http.post<any>('/api/payment/create-order', { amount });
  }

  // Request backend to verify the Razorpay payment signature
  verifyPayment(verificationData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }): Observable<any> {
    return this.http.post<any>('/api/payment/verify', verificationData);
  }

  // Save successfully placed order to Firestore
  saveOrder(orderData: any): Observable<any> {
    // Generate a unique order tracking ID
    const orderDocId = this.firestore.createId();
    const finalOrder = {
      ...orderData,
      orderDocId,
      createdAt: new Date().toISOString()
    };
    return from(this.firestore.collection('ecommerce_system/metadata/orders').doc(orderDocId).set(finalOrder));
  }

  // Fetch orders list for a specific buyer email
  getUserOrders(email: string): Observable<any[]> {
    return this.firestore.collection('ecommerce_system/metadata/orders', ref => 
      ref.where('email', '==', email).orderBy('createdAt', 'desc')
    ).valueChanges({ idField: 'id' });
  }
}
