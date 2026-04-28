import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SellerRegistrationService {
  private readonly apiBase = environment.sellerApiDomain || '/api';

  constructor(private readonly http: HttpClient) {}

  private post<T>(path: string, body: unknown, includeUserToken = false): Observable<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (includeUserToken) {
      const userToken = localStorage.getItem('userToken');
      if (userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
      }
    }

    return this.http.post<T>(`${this.apiBase}${path}`, JSON.stringify(body), {
      headers: new HttpHeaders(headers)
    });
  }

  getCities(): Observable<any> {
    return this.post('/common/getCities', { status: 'A' });
  }

  sendMobileOtp(name: string, mobile: string): Observable<any> {
    return this.post('/common/sendOtp', { name, mobile });
  }

  sendEmailOtp(sendTo: string, emailSubject: string, template: string): Observable<any> {
    return this.post('/common/send-mail', { sendTo, emailSubject, template });
  }

  verifyDocument(verFor: string, bodyData: Record<string, unknown>): Observable<any> {
    return this.post('/common/documentsVerification', { verFor, bodyData });
  }

  verifyReferralId(referralId: string): Observable<any> {
    return this.post('/co-trans/verifyReferralId', { referralId }, true);
  }

  initiatePayment(amount: number): Observable<any> {
    return this.post('/payment/initiate', { amount });
  }

  verifyPayment(paymentId: string): Observable<any> {
    return this.post('/payment/verify', { payment_id: paymentId });
  }

  addSellerRegistration(payload: Record<string, unknown>, token?: string): Observable<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    const authToken = token || localStorage.getItem('userToken') || '';
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return this.http.post<any>(`${this.apiBase}/co-master/addChampion`, JSON.stringify(payload), {
      headers: new HttpHeaders(headers)
    });
  }

  createSupplier(payload: any): Observable<any> {
    const base = environment.baseAPIURL || '';
    const baseUrl = !base ? '/' : (base.endsWith('/') ? base : `${base}/`);
    return this.http.post<any>(`${baseUrl}api/resource/Supplier`, payload, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    });
  }
}
