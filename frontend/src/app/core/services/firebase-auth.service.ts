import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { CartService } from './cart.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private userSubject = new BehaviorSubject<any>(this.getStoredUser());
  public user$: Observable<any> = this.userSubject.asObservable();
  public isLoggedIn$: Observable<boolean> = this.user$.pipe(map(user => !!user));
  private authChecked = new BehaviorSubject<boolean>(false);
  public authChecked$ = this.authChecked.asObservable();

  constructor(
    private router: Router,
    private cartService: CartService,
    private http: HttpClient
  ) {
    this.checkLoginStatus();
  }

  private get baseUrl() {
    const base = environment.baseAPIURL || '';
    if (!base) return '/';
    return base.endsWith('/') ? base : `${base}/`;
  }

  private get nodeBackendUrl() {
    return environment.nodeBackendUrl || '';
  }

  // Check Auth State on App Load
  checkLoginStatus(): void {
    if (!localStorage.getItem('erpnext_user') && !localStorage.getItem('isLogged')) {
      this.clearStoredUser();
      this.userSubject.next(null);
      this.authChecked.next(true);
      return;
    }

    this.http.get<{message: string}>(`${this.baseUrl}api/method/frappe.auth.get_logged_user`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          if (res.message && res.message !== 'Guest') {
            this.fetchUserDetails(res.message);
          } else {
            this.clearStoredUser();
            this.userSubject.next(null);
            this.authChecked.next(true);
          }
        },
        error: () => {
          this.clearStoredUser();
          this.userSubject.next(null);
          this.authChecked.next(true);
        }
      });
  }

  // Fetch Full User Details from ERPNext
  async fetchUserDetails(email: string): Promise<void> {
    const headers = {
      'Authorization': `token ${this.API_KEY}:${this.API_SECRET}`
    };
    
    try {
      const res: any = await this.http.get(`${this.baseUrl}api/resource/User/${email}`, { headers, withCredentials: true }).toPromise();
      if (res && res.data) {
        this.storeUser(res.data);
        this.userSubject.next(res.data);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      // Fallback to basic info if full fetch fails
      const fallbackUser = { email: email, uid: email };
      this.storeUser(fallbackUser);
      this.userSubject.next(fallbackUser);
    } finally {
      this.authChecked.next(true);
      // Always try to load the cart once we have a user context
      this.cartService.loadCart().subscribe();
    }
  }

  private storeUser(user: any): void {
    localStorage.setItem('erpnext_user', JSON.stringify(user));
  }

  private getStoredUser(): any {
    const stored = localStorage.getItem('erpnext_user');
    return stored ? JSON.parse(stored) : null;
  }

  private clearStoredUser(): void {
    localStorage.removeItem('erpnext_user');
  }

  // ERPNext Login
  async login(email: string, password: string): Promise<any> {
    try {
      await this.http.post(`${this.baseUrl}api/method/login`, { usr: email, pwd: password }, { withCredentials: true }).toPromise();
      
      let actualUserId = email;
      try {
        const userRes: any = await this.http.get(`${this.baseUrl}api/method/frappe.auth.get_logged_user`, { withCredentials: true }).toPromise();
        if (userRes && userRes.message && userRes.message !== 'Guest') {
          actualUserId = userRes.message;
        }
      } catch (e) {
        console.warn('Could not fetch actual logged user id, proceeding with login input:', e);
      }

      await this.fetchUserDetails(actualUserId);
      this.router.navigate(['/']);
      return { email: actualUserId };
    } catch (error) {
      console.error('ERPNext Login Error:', error);
      throw error;
    }
  }

  // ERPNext Logout
  async logout(): Promise<void> {
    try {
      await this.http.post(`${this.baseUrl}api/method/logout`, {}, { withCredentials: true }).toPromise();
    } catch (e) {
      console.warn('Backend logout failed or already logged out', e);
    }
    
    this.clearStoredUser();
    this.userSubject.next(null);
    this.authChecked.next(true);
    this.cartService.clearCart();
    this.router.navigate(['/login']);
  }

  // Check Auth State (Sync)
  async isLoggedIn(): Promise<boolean> {
    return !!this.userSubject.value;
  }

  // Stubs for Firebase Registration (Pending ERPNext implementation)
  // ERPNext Registration for Buyers
  // REPLACE THESE WITH YOUR ACTUAL ADMIN KEYS FROM ERPNEXT
  private readonly API_KEY = '764ae0b7b89ab0f';
  private readonly API_SECRET = 'c69b450d20ffcf2';

  async registerBuyer(buyerData: any): Promise<any> {
    const fullName = [buyerData.first_name, buyerData.middle_name, buyerData.last_name]
      .filter(n => n)
      .join(' ');

    const userPayload = {
      email: buyerData.email,
      first_name: buyerData.first_name,
      middle_name: buyerData.middle_name,
      last_name: buyerData.last_name,
      username: buyerData.username,
      mobile_no: buyerData.mobile,
      new_password: buyerData.password,
      language: buyerData.language,
      time_zone: buyerData.time_zone,
      send_welcome_email: buyerData.send_welcome_email ? 1 : 0,
      enabled: 1,
      role_profile_name: 'Customer',
      module_profile: 'Customer',
      roles: [
        { role: 'Customer' }
      ]
    };

    const customerPayload = {
      customer_name: fullName,
      customer_type: 'Individual',
      customer_group: 'All Customer Groups',
      territory: 'All Territories',
      email_id: buyerData.email,
      mobile_no: buyerData.mobile
    };

    const headers = {
      'Authorization': `token ${this.API_KEY}:${this.API_SECRET}`
    };

    try {
      // 1. Create User
      const userRes = await this.http.post(`${this.baseUrl}api/resource/User`, userPayload, { headers, withCredentials: true }).toPromise();
      
      // 2. Create Customer
      try {
        await this.http.post(`${this.baseUrl}api/resource/Customer`, customerPayload, { headers, withCredentials: true }).toPromise();
      } catch (custError) {
        console.error('ERPNext Customer Creation Error (User was created):', custError);
        // We don't throw here to avoid failing registration if user is created but customer fails (e.g. exists)
      }

      return userRes;
    } catch (error) {
      console.error('ERPNext Registration Error:', error);
      throw error;
    }
  }

  // Update ERPNext User
  updateERPNextUser(email: string, payload: any): Observable<any> {
    const headers = {
      'Authorization': `token ${this.API_KEY}:${this.API_SECRET}`
    };
    return this.http.put(`${this.baseUrl}api/resource/User/${email}`, payload, { headers, withCredentials: true });
  }

  // Get Customer by Email
  getCustomerByEmail(email: string): Observable<any> {
    console.log('getCustomerByEmail called with API_KEY:', this.API_KEY);
    const headers = { 'Authorization': `token ${this.API_KEY}:${this.API_SECRET}` };
    const filters = JSON.stringify([['email_id', '=', email]]);
    return this.http.get(`${this.baseUrl}api/resource/Customer?filters=${encodeURIComponent(filters)}&fields=["name"]`, { headers, withCredentials: true }).pipe(
      map((res: any) => res?.data?.[0]?.name || null)
    );
  }

  // Get Addresses for a Customer
  getCustomerAddresses(customerName: string): Observable<any[]> {
    const headers = { 'Authorization': `token ${this.API_KEY}:${this.API_SECRET}` };
    // In ERPNext, Address links are stored in child table 'links'. 
    // We can filter Address by joining Dynamic Link or directly if the API supports it.
    // The easiest way is to use `frappe.client.get_list` logic which allows querying child tables via Dynamic Link.
    // Let's use the Dynamic Link fields.
    const filters = JSON.stringify([['Dynamic Link', 'link_doctype', '=', 'Customer'], ['Dynamic Link', 'link_name', '=', customerName]]);
    const fields = JSON.stringify(['name', 'address_title', 'address_type', 'address_line1', 'address_line2', 'city', 'state', 'country', 'pincode', 'email_id', 'phone', 'is_primary_address', 'is_shipping_address', 'disabled']);
    return this.http.get(`${this.baseUrl}api/resource/Address?filters=${encodeURIComponent(filters)}&fields=${encodeURIComponent(fields)}`, { headers, withCredentials: true }).pipe(
      map((res: any) => res?.data || [])
    );
  }

  // Create Address
  createAddress(addressData: any, customerName: string): Observable<any> {
    const headers = { 'Authorization': `token ${this.API_KEY}:${this.API_SECRET}` };
    const payload = {
      ...addressData,
      links: [{ link_doctype: 'Customer', link_name: customerName }]
    };
    return this.http.post(`${this.baseUrl}api/resource/Address`, payload, { headers, withCredentials: true });
  }

  // Update Address
  updateAddress(addressName: string, addressData: any): Observable<any> {
    const headers = { 'Authorization': `token ${this.API_KEY}:${this.API_SECRET}` };
    return this.http.put(`${this.baseUrl}api/resource/Address/${encodeURIComponent(addressName)}`, addressData, { headers, withCredentials: true });
  }

  // Check if a User with this email exists in ERPNext
  async checkUserExists(email: string): Promise<boolean> {
    const headers = { 'Authorization': `token ${this.API_KEY}:${this.API_SECRET}` };
    try {
      const res: any = await this.http.get(
        `${this.baseUrl}api/resource/User/${encodeURIComponent(email)}`,
        { headers, withCredentials: true }
      ).toPromise();
      return !!(res?.data?.email);
    } catch (err: any) {
      if (err?.status === 404) return false;
      throw err;
    }
  }

  // Reset (change) password for an ERPNext user
  async resetPassword(email: string, newPassword: string): Promise<void> {
    const headers = { 'Authorization': `token ${this.API_KEY}:${this.API_SECRET}` };
    await this.http.put(
      `${this.baseUrl}api/resource/User/${encodeURIComponent(email)}`,
      { new_password: newPassword },
      { headers, withCredentials: true }
    ).toPromise();
  }

  // Get Candid Categories from external Firestore project via REST API
  getCandidCategories(type: string): Observable<any[]> {
    const url = 'https://firestore.googleapis.com/v1/projects/candid-cf9fc/databases/(default)/documents/candidCatsList?pageSize=300';
    return this.http.get<any>(url).pipe(
      map(response => {
        let docs = (response.documents || []).map((doc: any) => {
          const fields = doc.fields || {};
          return {
            catId: fields.catId?.stringValue || doc.name.split('/').pop(),
            catName: fields.catName?.stringValue || '',
            catType: fields.catType?.stringValue || '',
            catImg: fields.catImg?.stringValue || '',
            catShortCode: fields.catShortCode?.stringValue || ''
          };
        });

        if (type && type !== 'both') {
          const targetType = type.toLowerCase();
          docs = docs.filter((d: any) => d.catType && d.catType.toLowerCase() === targetType);
        }
        
        return docs;
      })
    );
  }
}
