import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { SellerRegistrationService } from 'src/app/shared/services/seller-registration.service';

interface CityOption {
  cityId: string;
  cityName: string;
}

@Component({
  selector: 'app-seller-registration',
  templateUrl: './seller-registration.component.html',
  styleUrls: ['./seller-registration.component.css']
})
export class SellerRegistrationComponent implements OnInit {
  sellerForm!: FormGroup;

  loading = false;

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

  paymentMethod: 'online' | 'cheque' = 'online';
  chequeImage: string | null = null;

  profilePhoto: string | null = null;
  panPhoto: string | null = null;
  aadharPhoto: string | null = null;
  bankChequePhoto: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly sellerService: SellerRegistrationService
  ) {}

  ngOnInit(): void {
    this.sellerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fatherHusbandName: ['', Validators.required],
      fatherHusbandRelation: ['F', Validators.required],
      gender: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      otp: [''],
      email: ['', [Validators.required, Validators.email]],
      mailOtp: [''],
      panNo: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      aadharNo: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
      aadharOtp: [''],
      isGstRegistered: [false],
      gstNo: ['', Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)],
      bankAccountNo: ['', Validators.required],
      bankIFSCCode: ['', Validators.required],
      bankAccountName: ['', Validators.required],
      bankName: ['', Validators.required],
      bankBranch: ['', Validators.required],
      addressLine1: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      cityId: ['', Validators.required],
      cityName: [''],
      tshirtSize: ['', Validators.required],
      referralId: [''],
      agreedToTerms: [false, Validators.requiredTrue],
      profilePhotoData: ['', Validators.required],
      panPhotoData: ['', Validators.required],
      aadharPhotoData: ['', Validators.required],
      bankCancelChqPhotoData: ['', Validators.required],
      paymentMethod: ['online'],
      chequeImage: [''],
      paymentStatus: ['0'],
      championTypeId: ['306eac7c4044d11cc8e58b014f7dfdc0']
    });

    this.fetchCities();
    this.fetchTermsAndConditions();
  }

  get cf() {
    return this.sellerForm.controls;
  }

  onCityChange(cityId: string): void {
    const city = this.cities.find((c) => c.cityId === cityId);
    this.sellerForm.patchValue({ cityName: city?.cityName || '' });
  }

  verifyPAN(): void {
    const panNo = this.cf['panNo'].value;
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
          const success = response?.status === 'SUCCESS';
          this.isPanVerified = success;
          this.panVerMsg = success ? 'PAN verified successfully' : 'PAN verification failed';
          if (success) {
            this.cf['panNo'].disable();
          }
        },
        error: () => {
          this.isPanVerified = false;
          this.panVerMsg = 'PAN verification failed';
        }
      });
  }

  verifyBank(): void {
    const accountNo = this.cf['bankAccountNo'].value;
    const ifscCode = this.cf['bankIFSCCode'].value;

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
        error: () => {
          this.isBankVerified = false;
          this.bankVerMsg = 'Bank verification failed';
        }
      });
  }

  verifyGST(): void {
    const gstNo = this.cf['gstNo'].value;
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
          this.isGstVerified = response?.status === 'SUCCESS';
          this.gstVerMsg = this.isGstVerified ? 'GST verified successfully' : 'GST verification failed';
        },
        error: () => {
          this.isGstVerified = false;
          this.gstVerMsg = 'GST verification failed';
        }
      });
  }

  sendAadharOTP(): void {
    const aadharNo = this.cf['aadharNo'].value;
    if (!aadharNo) {
      window.alert('Please enter Aadhaar number');
      return;
    }

    this.loading = true;
    this.sellerService
      .verifyDocument('aadhaar-otp', { aadhaar: aadharNo })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.mobileOtpSent = true;
          this.aadharVerMsg = 'Aadhaar OTP sent successfully';
        },
        error: () => {
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
          this.generatedOTP = response?.otp?.toString() || '';
          this.mobileOtpSent = true;
          this.mobileVerMsg = 'OTP sent successfully';
        },
        error: () => {
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

  selectPhoto(event: Event, formControlName: string, target: 'profilePhoto' | 'panPhoto' | 'aadharPhoto' | 'bankChequePhoto'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      window.alert('Please select JPG/PNG/PDF file only');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() || '';
      this.sellerForm.patchValue({ [formControlName]: result });
      (this as any)[target] = result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.sellerForm.invalid) {
      this.sellerForm.markAllAsTouched();
      window.alert('Please fill all required seller details correctly');
      return;
    }

    if (this.paymentMethod === 'cheque' && !this.chequeImage) {
      window.alert('Please upload cheque image before submission');
      return;
    }

    const payload = {
      ...this.sellerForm.getRawValue(),
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentMethod === 'online' ? '2' : '1',
      panVerified: this.isPanVerified,
      bankVerified: this.isBankVerified,
      aadharVerified: this.isAadharVerified,
      gstVerified: this.isGstVerified,
      referralVerified: this.isReferralVerified
    };

    this.loading = true;
    this.sellerService
      .addSellerRegistration(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (result) => {
          if (result?.responseStatus === 'Ok' || result?.responseStatus === 'OK') {
            window.alert('Seller registration request sent successfully');
            this.sellerForm.reset();
            this.paymentMethod = 'online';
          } else {
            window.alert(result?.message || 'Seller registration failed');
          }
        },
        error: (err) => {
          window.alert(err?.error?.message || 'Seller registration failed');
        }
      });
  }

  private fetchCities(): void {
    this.sellerService.getCities().subscribe({
      next: (response) => {
        this.cities = response?.cities || [];
      },
      error: () => {
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
