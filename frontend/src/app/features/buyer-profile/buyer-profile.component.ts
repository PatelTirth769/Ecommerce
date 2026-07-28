import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { PaymentService } from '../../core/services/payment.service';
import { Observable, of, switchMap, catchError, BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-buyer-profile',
  templateUrl: './buyer-profile.component.html',
  styles: []
})
export class BuyerProfileComponent implements OnInit {
  profileData$: Observable<any> | null = null;
  orders$: Observable<any> | null = null;
  activeTab: 'details' | 'orders' | 'business' | 'addresses' = 'details';
  
  // Address fields
  addressForm!: FormGroup;
  isSavingAddress = false;
  addressSaveSuccess = false;
  addressSaveError = '';
  addressesSubject = new BehaviorSubject<any[]>([]);
  addresses$ = this.addressesSubject.asObservable();
  customerName: string | null = null;
  showAddAddressForm = false;
  editingAddressName: string | null = null;
  
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

    // Initialize Address Form
    this.addressForm = this.fb.group({
      address_title: ['', Validators.required],
      address_type: ['Billing', Validators.required],
      address_line1: ['', Validators.required],
      address_line2: [''],
      city: ['', Validators.required],
      state: [''],
      country: ['India', Validators.required],
      pincode: [''],
      is_primary_address: [0],
      is_shipping_address: [0],
      disabled: [0]
    });

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

        // Load Addresses
        this.loadAddresses(user.email);
      }
    });
  }

  loadAddresses(email: string) {
    this.authService.getCustomerByEmail(email).pipe(
      switchMap(customerName => {
        if (customerName) {
          this.customerName = customerName;
          return this.authService.getCustomerAddresses(customerName);
        }
        return of([]);
      })
    ).subscribe({
      next: (addresses) => {
        this.addressesSubject.next(addresses);
      },
      error: (err) => console.error('Error loading addresses', err)
    });
  }

  switchTab(tab: 'details' | 'orders' | 'business' | 'addresses'): void {
    this.activeTab = tab;
  }

  getInvoiceUrl(razorpayOrderId: string): string {
    return this.paymentService.getInvoiceDownloadUrl(razorpayOrderId);
  }

  getPaymentEntryUrl(razorpayOrderId: string): string {
    return this.paymentService.getPaymentEntryDownloadUrl(razorpayOrderId);
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

  saveAddress(): void {
    this.addressSaveError = '';
    
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      this.addressSaveError = 'Please fill out all required fields.';
      console.log('Address form is invalid:', this.addressForm.errors, this.addressForm.value);
      return;
    }

    if (!this.customerName) {
      this.addressSaveError = 'No linked Customer profile found for this user. Cannot save address.';
      console.warn('Cannot save address: customerName is null.');
      return;
    }

    this.isSavingAddress = true;
    this.addressSaveSuccess = false;

    const payload = this.addressForm.getRawValue();
    // Convert boolean-like checkboxes if necessary (using 1/0 for ERPNext)
    payload.is_primary_address = payload.is_primary_address ? 1 : 0;
    payload.is_shipping_address = payload.is_shipping_address ? 1 : 0;
    payload.disabled = payload.disabled ? 1 : 0;

    const saveObservable = this.editingAddressName 
      ? this.authService.updateAddress(this.editingAddressName, payload)
      : this.authService.createAddress(payload, this.customerName);

    saveObservable.subscribe({
      next: (res) => {
        this.isSavingAddress = false;
        this.addressSaveSuccess = true;
        this.addressForm.reset({
          address_type: 'Billing',
          country: 'India',
          is_primary_address: 0,
          is_shipping_address: 0,
          disabled: 0
        });
        this.showAddAddressForm = false;
        this.editingAddressName = null;
        // Reload addresses
        this.authService.user$.subscribe(user => {
          if (user && user.email) this.loadAddresses(user.email);
        }).unsubscribe();
        setTimeout(() => this.addressSaveSuccess = false, 3000);
      },
      error: (err) => {
        console.error('Failed to save address', err);
        this.isSavingAddress = false;
        this.addressSaveError = 'Failed to save address. Please try again.';
      }
    });
  }

  editAddress(addr: any): void {
    this.editingAddressName = addr.name;
    this.showAddAddressForm = true;
    this.addressForm.patchValue({
      address_title: addr.address_title,
      address_type: addr.address_type,
      address_line1: addr.address_line1,
      address_line2: addr.address_line2,
      city: addr.city,
      state: addr.state,
      country: addr.country,
      pincode: addr.pincode,
      is_primary_address: addr.is_primary_address,
      is_shipping_address: addr.is_shipping_address,
      disabled: addr.disabled
    });
  }

  cancelEditAddress(): void {
    this.showAddAddressForm = false;
    this.editingAddressName = null;
    this.addressForm.reset({
      address_type: 'Billing',
      country: 'India',
      is_primary_address: 0,
      is_shipping_address: 0,
      disabled: 0
    });
  }
}
