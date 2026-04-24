import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { SellerRegistrationService } from 'src/app/shared/services/seller-registration.service';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';


interface CityOption {
  cityId: string;
  cityName: string;
}

export interface Category {
  catID: string;
  catName: string;
  catImg?: string;
  catType?: string;
}

@Component({
  selector: 'app-seller-registration',
  templateUrl: './seller-registration.component.html',
  styleUrls: ['./seller-registration.component.css']
})
export class SellerRegistrationComponent implements OnInit {
  sellerForm!: FormGroup;

  loading = false;
  successMessage = '';
  errorMessage = '';

  cities: CityOption[] = [];
  termsAndConditions: string[] = [];

  isPanVerified = false;
  isBankVerified = false;
  isAadharVerified = false;
  isMobileVerified = false;
  isMailVerified = false;
  isGstVerified = false;
  isReferralVerified = false;

  panVerMsg = '';
  bankVerMsg = '';
  aadharVerMsg = '';
  mobileVerMsg = '';
  mailVerMsg = '';
  gstVerMsg = '';
  referralVerMsg = '';

  mobileOtpSent = false;
  mailOtpSent = false;

  generatedOTP = '';
  generatedMailOTP = '';

  paymentMethod: 'online' | 'cheque' = 'cheque';
  chequeImage: string | null = null;

  profilePhoto: string | null = null;
  panPhoto: string | null = null;
  aadharPhoto: string | null = null;
  bankChequePhoto: string | null = null;
  companyLogo: string | null = null;

  availableCategories: Category[] = [];
  selectedCategories: Category[] = [];
  isLoadingCategories = false;
  isCategoryDropdownOpen = false;

  citySearchText = '';
  isCityDropdownOpen = false;
  filteredCities: CityOption[] = [];

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly sellerService: SellerRegistrationService,
    private readonly authService: FirebaseAuthService,
    private readonly router: Router,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    console.log('[SellerReg] Component initialized');
    this.sellerForm = this.fb.group({
      // Personnel Details
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fatherHusbandName: [''],
      fatherHusbandRelation: ['F'],
      gender: [''],
      mobile: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      mailOtp: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],

      // Identity Verification
      panNo: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      aadharNo: ['', [Validators.pattern(/^[0-9]{12}$/)]],
      isGstRegistered: [false],
      gstNo: ['', Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)],

      // Business Details
      businessName: [''],
      companyType: [''],
      companyPan: [''],
      companyLogoData: [''],

      // Bank Details
      bankAccountNo: [''],
      bankIFSCCode: [''],
      bankAccountName: [''],
      bankName: [''],
      bankBranch: [''],
      
      // Category
      categoryType: [''],

      // Address
      addressLine1: [''],
      street: [''],
      pincode: ['', [Validators.pattern(/^[0-9]{6}$/)]],
      cityId: [''],
      cityName: [''],
      state: [''],

      // Referral
      referralId: [''],

      // Terms
      agreedToTerms: [false, Validators.requiredTrue],

      // Documents
      profilePhotoData: [''],
      panPhotoData: [''],
      aadharPhotoData: [''],

      // Payment
      paymentMethod: ['cheque'],
      chequeImage: [''],
      paymentStatus: ['0'],
      championTypeId: ['306eac7c4044d11cc8e58b014f7dfdc0']
    }, { validators: this.passwordMatchValidator });

    this.fetchCities();
    this.fetchTermsAndConditions();
    console.log('[SellerReg] Form group created with controls:', Object.keys(this.sellerForm.controls));
  }

  get cf() {
    return this.sellerForm.controls;
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  isCategorySelected(catID: string): boolean {
    return this.selectedCategories.some(c => c.catID === catID);
  }

  toggleCategory(cat: Category): void {
    const index = this.selectedCategories.findIndex(c => c.catID === cat.catID);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(cat);
    }
  }

  onCategoryTypeChange(type: string): void {
    this.selectedCategories = [];
    this.availableCategories = [];
    
    if (!type) {
      return;
    }

    this.isLoadingCategories = true;
    this.authService.getCandidCategories(type).subscribe({
      next: (res) => {
        this.availableCategories = res.map(cat => ({
          catID: cat.catId || cat.catID,
          catName: cat.catName,
          catType: cat.catType,
          catImg: cat.catImg
        }));
        console.log(`[SellerReg] Fetched ${this.availableCategories.length} categories from Firebase for type ${type}`);
        this.isLoadingCategories = false;
      },
      error: (err) => {
        console.error('[SellerReg] Error fetching categories from Firebase:', err);
        this.isLoadingCategories = false;
      }
    });
  }

  onCityChange(cityId: string): void {
    const city = this.cities.find((c) => c.cityId === cityId);
    this.sellerForm.patchValue({ 
      cityId: city?.cityId || '',
      cityName: city?.cityName || '' 
    });
  }

  filterCities(event: any): void {
    const text = event.target.value.toLowerCase();
    this.citySearchText = text;
    this.isCityDropdownOpen = true;
    this.filteredCities = this.cities.filter(c => 
      c.cityName.toLowerCase().includes(text)
    );
  }

  selectCity(city: CityOption): void {
    this.sellerForm.patchValue({ 
      cityId: city.cityId,
      cityName: city.cityName 
    });
    this.citySearchText = city.cityName;
    this.isCityDropdownOpen = false;
  }

  toggleCityDropdown(): void {
    this.isCityDropdownOpen = !this.isCityDropdownOpen;
    if (this.isCityDropdownOpen) {
      this.filteredCities = this.cities;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.searchable-dropdown')) {
      this.isCityDropdownOpen = false;
    }
  }

  verifyPAN(): void {
    const panNo = this.cf['panNo'].value;
    console.log('[SellerReg] verifyPAN called, panNo:', panNo);
    if (!panNo) {
      window.alert('Please enter PAN number');
      return;
    }

    this.loading = true;
    this.sellerService
      .verifyDocument('pan-verification', { entity: panNo })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          console.log('[SellerReg] PAN verify response:', response);
          const success = response?.status === 'SUCCESS';
          this.isPanVerified = success;
          this.panVerMsg = success ? 'PAN verified successfully' : 'PAN verification failed';
          if (success) {
            this.cf['panNo'].disable();
          }
        },
        error: (err) => {
          console.error('[SellerReg] PAN verify error:', err);
          this.isPanVerified = false;
          this.panVerMsg = 'PAN verification failed';
        }
      });
  }

  verifyBank(): void {
    const accountNo = this.cf['bankAccountNo'].value;
    const ifscCode = this.cf['bankIFSCCode'].value;
    console.log('[SellerReg] verifyBank called, accountNo:', accountNo, 'ifsc:', ifscCode);

    if (!accountNo || !ifscCode) {
      window.alert('Please enter account number and IFSC code');
      return;
    }

    this.loading = true;
    this.sellerService
      .verifyDocument('bank-verification', {
        acc_number: accountNo.toString(),
        ifsc_number: ifscCode.toString().toUpperCase()
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          console.log('[SellerReg] Bank verify response:', response);
          const accountName = response?.data?.result?.accountName;
          this.isBankVerified = !!accountName;
          this.bankVerMsg = this.isBankVerified
            ? `Verified: ${accountName}`
            : 'Bank verification failed';

          if (this.isBankVerified) {
            this.sellerForm.patchValue({
              bankAccountName: accountName,
              bankName: response?.data?.result?.bankName || this.cf['bankName'].value
            });
            this.cf['bankAccountNo'].disable();
            this.cf['bankIFSCCode'].disable();
          }
        },
        error: (err) => {
          console.error('[SellerReg] Bank verify error:', err);
          this.isBankVerified = false;
          this.bankVerMsg = 'Bank verification failed';
        }
      });
  }

  verifyGST(): void {
    const gstNo = this.cf['gstNo'].value;
    console.log('[SellerReg] verifyGST called, gstNo:', gstNo);
    if (!gstNo) {
      window.alert('Please enter GST number');
      return;
    }

    this.loading = true;
    this.sellerService
      .verifyDocument('gst-verification', { gstin: gstNo })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          console.log('[SellerReg] GST verify response:', response);
          this.isGstVerified = response?.status === 'SUCCESS';
          this.gstVerMsg = this.isGstVerified ? 'GST verified successfully' : 'GST verification failed';
        },
        error: (err) => {
          console.error('[SellerReg] GST verify error:', err);
          this.isGstVerified = false;
          this.gstVerMsg = 'GST verification failed';
        }
      });
  }

  sendAadharOTP(): void {
    const aadharNo = this.cf['aadharNo'].value;
    console.log('[SellerReg] sendAadharOTP called, aadharNo:', aadharNo);
    if (!aadharNo) {
      window.alert('Please enter Aadhaar number');
      return;
    }

    this.loading = true;
    this.sellerService
      .verifyDocument('aadhaar-otp', { aadhaar: aadharNo })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          console.log('[SellerReg] Aadhaar OTP sent response:', res);
          this.mobileOtpSent = true;
          this.aadharVerMsg = 'Aadhaar OTP sent successfully';
        },
        error: (err) => {
          console.error('[SellerReg] Aadhaar OTP send error:', err);
          this.aadharVerMsg = 'Unable to send Aadhaar OTP. Please upload Aadhaar card image for manual verification.';
        }
      });
  }

  verifyAadharOTP(): void {
    const otp = this.cf['aadharOtp'].value;
    const aadharNo = this.cf['aadharNo'].value;

    if (!otp) {
      window.alert('Please enter Aadhaar OTP');
      return;
    }

    this.loading = true;
    this.sellerService
      .verifyDocument('aadhaar-verification', { otp, aadhaar: aadharNo })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.isAadharVerified = response?.status === 'SUCCESS';
          this.aadharVerMsg = this.isAadharVerified ? 'Aadhaar verified successfully' : 'Aadhaar verification failed';
          if (this.isAadharVerified) {
            this.cf['aadharNo'].disable();
            this.mobileOtpSent = false;
          }
        },
        error: () => {
          this.isAadharVerified = false;
          this.aadharVerMsg = 'Aadhaar verification failed. You can continue with manual document verification.';
        }
      });
  }

  sendOTP(): void {
    const mobile = this.cf['mobile'].value;
    const name = this.cf['firstName'].value || 'User';
    console.log('[SellerReg] sendOTP called, mobile:', mobile, 'name:', name);

    if (!/^[6-9]\d{9}$/.test(mobile || '')) {
      window.alert('Please enter a valid 10-digit mobile number');
      return;
    }

    this.loading = true;
    this.sellerService
      .sendMobileOtp(name, mobile)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          console.log('[SellerReg] Mobile OTP sent response:', response);
          this.generatedOTP = response?.otp?.toString() || '';
          this.mobileOtpSent = true;
          this.mobileVerMsg = 'OTP sent successfully';
        },
        error: (err) => {
          console.error('[SellerReg] Mobile OTP send error:', err);
          this.mobileVerMsg = 'Unable to send OTP';
        }
      });
  }

  verifyOTP(): void {
    const enteredOtp = this.cf['otp'].value?.toString();
    if (!enteredOtp) {
      window.alert('Please enter OTP');
      return;
    }

    if (enteredOtp === this.generatedOTP) {
      this.isMobileVerified = true;
      this.mobileOtpSent = false;
      this.mobileVerMsg = 'Mobile number verified';
      this.cf['mobile'].disable();
      return;
    }

    this.mobileVerMsg = 'Invalid OTP';
  }

  sendMailOTP(): void {
    const email = this.cf['email'].value;
    if (!email) {
      window.alert('Please enter email address');
      return;
    }

    this.generatedMailOTP = `${Math.floor(Math.random() * 9000) + 1000}`;
    const template = `<p>Your OTP is <b>${this.generatedMailOTP}</b></p>`;

    this.loading = true;
    this.sellerService
      .sendEmailOtp(email, 'Seller Registration OTP', template)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.mailOtpSent = true;
          this.mailVerMsg = 'Email OTP sent successfully';
        },
        error: () => {
          this.mailVerMsg = 'Unable to send email OTP';
        }
      });
  }

  verifyMailOTP(): void {
    const enteredOtp = this.cf['mailOtp'].value?.toString();
    if (!enteredOtp) {
      window.alert('Please enter email OTP');
      return;
    }

    if (enteredOtp === this.generatedMailOTP) {
      this.isMailVerified = true;
      this.mailOtpSent = false;
      this.mailVerMsg = 'Email verified';
      this.cf['email'].disable();
      return;
    }

    this.mailVerMsg = 'Invalid email OTP';
  }

  verifyReferralId(): void {
    const referralId = this.cf['referralId'].value;
    if (!referralId) {
      this.referralVerMsg = 'Please enter referral ID';
      this.isReferralVerified = false;
      return;
    }

    this.loading = true;
    this.sellerService
      .verifyReferralId(referralId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.isReferralVerified = response?.responseStatus === 'OK';
          this.referralVerMsg = this.isReferralVerified
            ? 'Referral ID verified successfully'
            : 'Referral ID not found';

          if (this.isReferralVerified) {
            this.cf['referralId'].disable();
          }
        },
        error: () => {
          this.isReferralVerified = false;
          this.referralVerMsg = 'Referral verification failed';
        }
      });
  }

  onPaymentMethodChange(method: 'online' | 'cheque'): void {
    this.paymentMethod = method;
    this.sellerForm.patchValue({ paymentMethod: method });
  }

  onChequeImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() || '';
      this.chequeImage = result;
      this.sellerForm.patchValue({ chequeImage: result });
    };
    reader.readAsDataURL(file);
  }

  selectPhoto(event: Event, formControlName: string, target: 'profilePhoto' | 'panPhoto' | 'aadharPhoto' | 'bankChequePhoto' | 'companyLogo'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      console.warn('[SellerReg] Invalid file type:', file.type, 'for', target);
      window.alert('Please select JPG/PNG/PDF file only');
      input.value = '';
      return;
    }

    console.log('[SellerReg] File selected for', target, '- name:', file.name, 'size:', file.size, 'type:', file.type);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() || '';
      console.log('[SellerReg] File read complete for', target, '- base64 length:', result.length);
      this.sellerForm.patchValue({ [formControlName]: result });
      (this as any)[target] = result;
    };
    reader.readAsDataURL(file);
  }

  async onSubmit(): Promise<void> {
    console.log('[SellerReg] ========== SUBMIT STARTED ==========');
    this.successMessage = '';
    this.errorMessage = '';

    // Log form validity state
    console.log('[SellerReg] Form valid:', this.sellerForm.valid);
    console.log('[SellerReg] Form errors:', this.sellerForm.errors);

    // Log each control's validity
    const invalidControls: string[] = [];
    Object.keys(this.sellerForm.controls).forEach(key => {
      const control = this.sellerForm.get(key);
      if (control?.invalid) {
        invalidControls.push(`${key} (errors: ${JSON.stringify(control.errors)})`);
      }
    });
    if (invalidControls.length > 0) {
      console.log('🛑 [SellerReg] INVALID CONTROLS FOUND:', invalidControls);
    }

    if (this.sellerForm.invalid) {
      this.sellerForm.markAllAsTouched();

      // Check for password mismatch specifically
      if (this.sellerForm.hasError('mismatch')) {
        console.log('🛑 [SellerReg] Password mismatch detected');
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      // Provide user-friendly field names for the UI error message
      const fieldNames: Record<string, string> = {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'Business Name',
        companyType: 'Type of Company',
        mobile: 'Mobile Number',
        email: 'Email',
        companyPan: 'Company PAN',
        panNo: 'PAN No',
        aadharNo: 'Aadhaar Number',
        bankAccountNo: 'Bank Account No',
        bankIFSCCode: 'IFSC Code',
        bankAccountName: 'Bank Account Name',
        bankName: 'Bank Name',
        bankBranch: 'Branch Name',
        categoryType: 'Category Type',
        addressLine1: 'Flat / House No',
        street: 'Street',
        pincode: 'Pincode',
        stateName: 'State',
        cityName: 'City',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        terms: 'Terms & Conditions'
      };

      const missingFieldsText = invalidControls.map(c => {
        const key = c.split(' ')[0];
        return fieldNames[key] || key;
      }).join(', ');

      console.log('🛑 [SellerReg] Form is invalid, aborting submit. See invalid fields above.');
      this.errorMessage = `Please fix the following fields: ${missingFieldsText}`;
      this.toastService.showError(this.errorMessage);
      return;
    }



    const raw = this.sellerForm.getRawValue();
    console.log('[SellerReg] Raw form values:', { ...raw, password: '***', confirmPassword: '***', profilePhotoData: raw.profilePhotoData ? `[base64 ${raw.profilePhotoData.length} chars]` : '', panPhotoData: raw.panPhotoData ? `[base64 ${raw.panPhotoData.length} chars]` : '', aadharPhotoData: raw.aadharPhotoData ? `[base64 ${raw.aadharPhotoData.length} chars]` : '', bankCancelChqPhotoData: raw.bankCancelChqPhotoData ? `[base64 ${raw.bankCancelChqPhotoData.length} chars]` : '', companyLogoData: raw.companyLogoData ? `[base64 ${raw.companyLogoData.length} chars]` : '' });

    // Map gender codes to full names
    const genderMap: Record<string, string> = { M: 'Male', F: 'Female', O: 'Other' };

    // Build the seller data payload for the service
    const sellerPayload = {
      email: raw.email,
      password: raw.password,
      userFullName: `${raw.firstName} ${raw.lastName}`.trim(),
      userMobile1: `+91 ${raw.mobile}`,
      userGender: genderMap[raw.gender] || raw.gender || '',
      userBusinessName: raw.businessName || '',
      userSelectedTypeOfCompany: raw.companyType || '',
      CompanyPan: raw.companyPan || '',
      userPanNo: raw.panNo || '',
      aadhaarNo: raw.aadharNo || '',
      userGstNo: raw.gstNo || '',
      userAddress: `${raw.addressLine1}, ${raw.cityName || ''}, ${raw.pincode || ''}`.trim(),
      userAddressLine1: raw.addressLine1 || '',
      userAddressLine2: raw.street || '',
      userAddressStreet: raw.street || '',
      userAddressCity: raw.cityName || '',
      userAddressPinCode: raw.pincode || '',
      userAddressState: raw.state || '',
      bankAccountHolderName: raw.bankAccountName || '',
      bankAccountHolderAcNumber: raw.bankAccountNo || '',
      bankAccountHolderIFSC: raw.bankIFSCCode || '',
      bankAccountHolderBankName: raw.bankName || '',
      bankAccountHolderBankBranch: raw.bankBranch || '',
      userProfilePic: raw.profilePhotoData || '',
      panCardImage: raw.panPhotoData || '',
      aadhaarCardImage: raw.aadharPhotoData || '',
      userCompanyLogo: raw.companyLogoData || '',
      paymentMethod: this.paymentMethod,
      paymentStatus: 'pending',
      chequeImage: this.chequeImage || '',
      referredBy: raw.referralId || '',
      championName: '',
      championMobile: '',
      categoryType: raw.categoryType || '',
      selectedCatsList: this.selectedCategories,
      fatherHusbandName: raw.fatherHusbandName || '',
      fatherHusbandRelation: raw.fatherHusbandRelation || '',
      panVerified: this.isPanVerified,
      bankVerified: this.isBankVerified,
      aadharVerified: this.isAadharVerified,
      gstVerified: this.isGstVerified,
    };

    console.log('[SellerReg] Seller payload built (password hidden):', { ...sellerPayload, password: '***', userProfilePic: sellerPayload.userProfilePic ? '[has data]' : '[empty]', panCardImage: sellerPayload.panCardImage ? '[has data]' : '[empty]', aadhaarCardImage: sellerPayload.aadhaarCardImage ? '[has data]' : '[empty]', userCompanyLogo: sellerPayload.userCompanyLogo ? '[has data]' : '[empty]', chequeImage: sellerPayload.chequeImage ? '[has data]' : '[empty]' });
    console.log('[SellerReg] Verification status — PAN:', this.isPanVerified, '| Bank:', this.isBankVerified, '| Aadhaar:', this.isAadharVerified, '| GST:', this.isGstVerified);
    console.log('[SellerReg] Payment method:', this.paymentMethod, '| Cheque uploaded:', !!this.chequeImage);

    this.loading = true;

    try {
      console.log('[SellerReg] Calling authService.registerSeller()...');
      const result = await this.authService.registerSeller(sellerPayload);
      console.log('[SellerReg] ✅ Registration SUCCESS! Result:', result);
      this.toastService.showSuccess('Seller registered successfully!');
      this.successMessage = 'Seller registration successful! Your profile is under review. You can now login with your email and password.';
      this.sellerForm.reset();
      this.paymentMethod = 'cheque';
      this.chequeImage = null;
      this.profilePhoto = null;
      this.panPhoto = null;
      this.aadharPhoto = null;
      this.bankChequePhoto = null;
      this.companyLogo = null;
      this.availableCategories = [];
      this.selectedCategories = [];

      // Redirect to login after 3 seconds
      console.log('[SellerReg] Redirecting to /login in 3 seconds...');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    } catch (error: any) {
      console.error('[SellerReg] ❌ Registration FAILED!');
      console.error('[SellerReg] Error code:', error?.code);
      console.error('[SellerReg] Error message:', error?.message);
      console.error('[SellerReg] Full error object:', error);
      if (error?.code === 'auth/email-already-in-use') {
        this.errorMessage = 'This email is already registered. Please use a different email or login.';
      } else if (error?.code === 'auth/weak-password') {
        this.errorMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (error?.code === 'auth/invalid-email') {
        this.errorMessage = 'Invalid email address format.';
      } else {
        this.errorMessage = error?.message || 'Seller registration failed. Please try again.';
      }
      this.toastService.showError(this.errorMessage);
      console.error('[SellerReg] User-facing error message:', this.errorMessage);
    } finally {
      this.loading = false;
      console.log('[SellerReg] ========== SUBMIT ENDED ==========');
    }
  }

  private fetchCities(): void {
    console.log('[SellerReg] Fetching cities...');
    this.sellerService.getCities().subscribe({
      next: (response) => {
        this.cities = response?.cities || [];
        this.filteredCities = this.cities;
        console.log('[SellerReg] Cities loaded:', this.cities.length, 'cities');
      },
      error: (err) => {
        console.error('[SellerReg] Failed to fetch cities:', err);
        this.cities = [];
      }
    });
  }

  private fetchTermsAndConditions(): void {
    this.termsAndConditions = [
      'All submitted information must be accurate and verifiable.',
      'Document checks can be auto or manual and may take up to 48 hours.',
      'After payment, profile details may be locked for compliance review.',
      'Candid Offers reserves the right to reject incomplete registrations.'
    ];
  }
}
