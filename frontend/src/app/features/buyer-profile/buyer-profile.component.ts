import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { PaymentService } from '../../core/services/payment.service';
import { Observable, of, switchMap, catchError } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-buyer-profile',
  templateUrl: './buyer-profile.component.html',
  styles: []
})
export class BuyerProfileComponent implements OnInit {
  profileData$: Observable<any> | null = null;
  orders$: Observable<any> | null = null;
  activeTab: 'details' | 'orders' | 'business' = 'details';
  
  businessForm!: FormGroup;
  isSavingBusiness = false;
  businessSaveSuccess = false;
  businessSaveError = '';

  basicInfoForm!: FormGroup;
  isSavingBasicInfo = false;
  basicInfoSaveSuccess = false;
  basicInfoSaveError = '';

  showPassword = false;

  constructor(
    public authService: FirebaseAuthService,
    private paymentService: PaymentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.profileData$ = this.authService.user$;
    
    // Initialize Business Form with regex validations
    this.businessForm = this.fb.group({
      email: [''],
      full_address: [''],
      state: [''],
      city: [''],
      gst: ['', [Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]],
      msme: ['', [Validators.pattern('^UDYAM-[A-Z]{2}-\\d{2}-\\d{7}$')]],
      aadhar: ['', [Validators.pattern('^\\d{12}$')]],
      pan: ['', [Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]],
      bank_name: [''],
      account_holder_name: [''],
      bank_account_number: ['', [Validators.pattern('^\\d{9,18}$')]],
      ifsc_code: ['', [Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],
      branch_name: ['']
    });

    // Initialize Basic Info Form
    this.basicInfoForm = this.fb.group({
      email: [{value: '', disabled: true}],
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: [''],
      full_name: [''],
      username: [''],
      mobile_no: [''],
      language: [''],
      time_zone: [''],
      send_welcome_email: [false],
      password: [''],
      confirm_password: ['']
    }, { validators: this.passwordMatchValidator });

    // Fetch user orders
    this.orders$ = this.authService.user$.pipe(
      switchMap(user => {
        if (!user || !user.email) {
          return of([]);
        }

        return this.paymentService.getUserOrders(user.email).pipe(
          catchError(err => {
            console.error('Error fetching orders from backend:', err);
            return of([]);
          })
        );
      })
    );

    // Fetch business details if seller
    this.authService.user$.subscribe(user => {
      if (user && user.email) {
        // Patch basic info form with ERPNext user data initially
        this.basicInfoForm.patchValue({
          email: user.email,
          first_name: user.first_name,
          middle_name: user.middle_name,
          last_name: user.last_name,
          full_name: user.full_name || user.name,
          username: user.username,
          mobile_no: user.mobile_no,
          language: user.language,
          time_zone: user.time_zone,
          send_welcome_email: user.send_welcome_email === 1 || user.send_welcome_email === true
        });


      }
    });
  }

  switchTab(tab: 'details' | 'orders' | 'business'): void {
    this.activeTab = tab;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirm_password')?.value;
    if (password || confirmPassword) {
      return password === confirmPassword ? null : { mismatch: true };
    }
    return null;
  }

  saveBusinessDetails(): void {
    // Seller profile saving has been removed
    this.businessSaveError = 'Business details saving is disabled for buyers.';
  }

  saveBasicInfo(): void {
    if (this.basicInfoForm.invalid) {
      this.basicInfoForm.markAllAsTouched();
      return;
    }

    this.isSavingBasicInfo = true;
    this.basicInfoSaveSuccess = false;
    this.basicInfoSaveError = '';

    const payload = this.basicInfoForm.getRawValue();

    // Ensure email is present
    if (!payload.email) {
      this.authService.user$.subscribe(u => {
        if (u && u.email) payload.email = u.email;
      }).unsubscribe();
    }

    if (!payload.email) {
      this.basicInfoSaveError = 'Could not find your email.';
      this.isSavingBasicInfo = false;
      return;
    }

    // If password was changed, update in ERPNext
    if (payload.password) {
      this.authService.updateERPNextUser(payload.email, { new_password: payload.password }).subscribe({
        next: () => {
          this.isSavingBasicInfo = false;
          this.basicInfoSaveSuccess = true;
          this.basicInfoForm.patchValue({ password: '', confirm_password: '' }); // Clear passwords after save
          setTimeout(() => this.basicInfoSaveSuccess = false, 3000);
        },
        error: (err) => {
          console.error('Failed to update ERPNext password', err);
          this.isSavingBasicInfo = false;
          this.basicInfoSaveError = 'Failed to update password in system. Please try again.';
        }
      });
    } else {
      this.isSavingBasicInfo = false;
      this.basicInfoSaveSuccess = true;
      setTimeout(() => this.basicInfoSaveSuccess = false, 3000);
    }
  }
}
