import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from './cart.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  public user$: Observable<any>;
  public isLoggedIn$: Observable<boolean>;

  private readonly candidApiUrl = 'https://us-central1-candid-cf9fc.cloudfunctions.net/app';

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

        // If type is not 'both', filter locally to ignore case sensitivity
        if (type && type !== 'both') {
          const targetType = type.toLowerCase();
          docs = docs.filter((d: any) => d.catType && d.catType.toLowerCase() === targetType);
        }
        
        return docs;
      })
    );
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

  // Register Seller — Dual storage: YOUR Firestore + Candid API
  async registerSeller(sellerData: any): Promise<any> {
    console.log('[AuthService] ========== registerSeller START ==========');
    console.log('[AuthService] Email:', sellerData.email);
    console.log('[AuthService] Full Name:', sellerData.userFullName);
    console.log('[AuthService] Mobile:', sellerData.userMobile1);
    console.log('[AuthService] Business:', sellerData.userBusinessName);
    try {
      // 1. Create Firebase Auth user in YOUR project (email + password for web login)
      console.log('[AuthService] Step 1: Creating Firebase Auth user...');
      const credential = await this.afAuth.createUserWithEmailAndPassword(sellerData.email, sellerData.password);
      const uid = credential.user?.uid;
      console.log('[AuthService] Step 1 ✅ Auth user created. UID:', uid);

      if (!uid) {
        throw new Error('Failed to create user account — no UID returned');
      }

      const now = new Date().toISOString();

      // 2. Build the profile data for YOUR Firestore (ecommerce_system/metadata/sellers/{uid})
      const localProfile: Record<string, any> = {
        role: 'seller',
        email: sellerData.email,
        createdAt: now,
        userFullName: sellerData.userFullName || '',
        userEmail1: sellerData.email || '',
        userMobile1: sellerData.userMobile1 || '',
        mobileCode: 'IN +91',
        userGender: sellerData.userGender || '',
        userBusinessName: sellerData.userBusinessName || '',
        userSelectedTypeOfCompany: sellerData.userSelectedTypeOfCompany || '',
        CompanyPan: sellerData.CompanyPan || '',
        userPanNo: sellerData.userPanNo || '',
        aadhaarNo: sellerData.aadhaarNo || '',
        userGstNo: sellerData.userGstNo || '',
        userAddress: sellerData.userAddress || '',
        userAddressLine1: sellerData.userAddressLine1 || '',
        userAddressLine2: sellerData.userAddressLine2 || '',
        userAddressStreet: sellerData.userAddressStreet || '',
        userAddressCity: sellerData.userAddressCity || '',
        userAddressPinCode: sellerData.userAddressPinCode || '',
        userAddressState: sellerData.userAddressState || '',
        bankAccountHolderName: sellerData.bankAccountHolderName || '',
        bankAccountHolderAcNumber: sellerData.bankAccountHolderAcNumber || '',
        bankAccountHolderAc1Number: sellerData.bankAccountHolderAcNumber || '',
        bankAccountHolderIFSC: sellerData.bankAccountHolderIFSC || '',
        bankAccountHolderIFSC1: sellerData.bankAccountHolderIFSC || '',
        bankAccountHolderBankName: sellerData.bankAccountHolderBankName || '',
        bankAccountHolderBankBranch: sellerData.bankAccountHolderBankBranch || '',
        userProfilePic: sellerData.userProfilePic || '',
        panCardImage: sellerData.panCardImage || '',
        aadhaarCardImage: sellerData.aadhaarCardImage || '',
        userCompanyLogo: sellerData.userCompanyLogo || '',
        paymentMethod: sellerData.paymentMethod || 'cheque',
        paymentStatus: sellerData.paymentStatus || 'pending',
        chequeImage: sellerData.chequeImage || '',
        profileStatus: 'under_review',
        isActive: true,
        isApproved: false,
        isFirstTimeSubscription: false,
        referredBy: sellerData.referredBy || '',
        championName: sellerData.championName || '',
        championMobile: sellerData.championMobile || '',
        selectedCatsList: sellerData.selectedCatsList || [],
        offerCount: 0,
        firebaseMessagingToken: '',
        candidOfferSubscriptionStartDate: null,
        candidOfferSubscriptionEndDate: null,
        offerSubscriptionEndDate: null,
        fatherHusbandName: sellerData.fatherHusbandName || '',
        fatherHusbandRelation: sellerData.fatherHusbandRelation || '',
        tshirtSize: sellerData.tshirtSize || '',
        panVerified: sellerData.panVerified || false,
        bankVerified: sellerData.bankVerified || false,
        aadharVerified: sellerData.aadharVerified || false,
        gstVerified: sellerData.gstVerified || false,
      };

      // Save to YOUR Firestore
      console.log('[AuthService] Step 2: Saving profile to Firestore at ecommerce_system/metadata/sellers/' + uid);
      console.log('[AuthService] Profile fields count:', Object.keys(localProfile).length);
      await this.firestore
        .collection('ecommerce_system')
        .doc('metadata')
        .collection('sellers')
        .doc(uid)
        .set(localProfile);
      console.log('[AuthService] Step 2 ✅ Firestore save successful');

      console.log('[AuthService] ========== registerSeller COMPLETE ✅ ==========');
      return { uid, credential };
    } catch (error: any) {
      console.error('[AuthService] ========== registerSeller FAILED ❌ ==========');
      console.error('[AuthService] Error code:', error?.code);
      console.error('[AuthService] Error message:', error?.message);
      console.error('[AuthService] Full error:', error);
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
