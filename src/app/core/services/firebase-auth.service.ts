import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from './cart.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  public user$: Observable<any>;
  public isLoggedIn$: Observable<boolean>;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private cartService: CartService,
    private http: HttpClient
  ) {
    this.user$ = this.afAuth.authState;
    this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user));
  }

  // Login
  async login(email: string, password: string): Promise<any> {
    try {
      const credential = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/profile']);
      return credential;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }

  // Register Buyer
  async registerBuyer(buyerData: any): Promise<any> {
    try {
      // 1. Create Auth User
      const credential = await this.afAuth.createUserWithEmailAndPassword(buyerData.email, buyerData.password);
      const uid = credential.user?.uid;

      if (uid) {
        // 2. Remove password from data before saving to Firestore
        const { password, confirmPassword, terms, ...profileData } = buyerData;
        profileData.role = 'buyer';
        profileData.createdAt = new Date().toISOString();

        // 3. Save profile to Firestore: ecommerce_system/metadata/buyers/{uid}
        await this.firestore.collection('ecommerce_system').doc('metadata').collection('buyers').doc(uid).set(profileData);
        
        this.router.navigate(['/profile']);
        return credential;
      }
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // Clear the ERPNext backend session to prevent guest cart bleeding
      await this.http.post(`${environment.baseAPIURL}/api/method/logout`, {}, { withCredentials: true }).toPromise().catch(() => {});
    } catch (e) {
      // Ignore errors if already logged out of backend
    }
    
    this.cartService.clearCart();
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

  // Check Auth State (Sync)
  async isLoggedIn(): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    return !!user;
  }
}
