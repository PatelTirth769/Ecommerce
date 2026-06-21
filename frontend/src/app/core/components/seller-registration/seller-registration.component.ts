import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { finalize, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SellerRegistrationService } from 'src/app/shared/services/seller-registration.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

import { FirebaseAuthService } from '../../services/firebase-auth.service';

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
  languages: any[] = [];
  supplierGroups: any[] = [];
  countries: any[] = [];
  currencies: any[] = [];
  priceLists: any[] = [];
  bankAccounts: any[] = [];
  taxCategories: any[] = [];
  taxWithholdingCategories: any[] = [];
  paymentTermsTemplates: any[] = [];
  companies: any[] = [];
  users: any[] = [];
  allAccounts: any[] = [];
  activeTab = 'details';

  tabs = [
    { id: 'details', label: 'User Details' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly sellerService: SellerRegistrationService,
    private readonly authService: FirebaseAuthService,
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.sellerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      username: [''],
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      language: ['en'],
      send_welcome_email: [true],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      supplier_name: [''] // Optional, will fallback to full name
    }, { validator: this.passwordMatchValidator });

    this.sellerForm.get('is_internal_supplier')?.valueChanges.subscribe(checked => {
      const representsControl = this.sellerForm.get('represents_company');
      if (checked) {
        representsControl?.setValidators([Validators.required]);
      } else {
        representsControl?.clearValidators();
      }
      representsControl?.updateValueAndValidity();
    });

    // this.fetchAllDropdownData(); // Not needed for simplified view
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  fetchAllDropdownData(): void {
    this.fetchDocTypeList('Language', ['name', 'language_name']).subscribe(data => this.languages = data);
    this.fetchDocTypeList('Supplier Group', ['name']).subscribe(data => this.supplierGroups = data);
    this.fetchDocTypeList('Country', ['name']).subscribe(data => this.countries = data);
    this.fetchDocTypeList('Currency', ['name']).subscribe(data => this.currencies = data);
    this.fetchDocTypeList('Price List', ['name']).subscribe(data => this.priceLists = data);
    this.fetchDocTypeList('Bank Account', ['name']).subscribe(data => this.bankAccounts = data);
    this.fetchDocTypeList('Tax Category', ['name']).subscribe(data => this.taxCategories = data);
    this.fetchDocTypeList('Tax Withholding Category', ['name']).subscribe(data => this.taxWithholdingCategories = data);
    this.fetchDocTypeList('Payment Terms Template', ['name']).subscribe(data => this.paymentTermsTemplates = data);
    this.fetchDocTypeList('Company', ['name']).subscribe(data => this.companies = data);
    this.fetchDocTypeList('User', ['name', 'full_name'], [['enabled', '=', 1]]).subscribe(data => this.users = data);
    this.fetchDocTypeList('Account', ['name'], [['is_group', '=', 0]]).subscribe(data => this.allAccounts = data);
  }

  fetchDocTypeList(doctype: string, fields: string[] = ['name'], filters: any[] = []): Observable<any[]> {
    const base = environment.baseAPIURL || '';
    const baseUrl = !base ? '/' : (base.endsWith('/') ? base : `${base}/`);
    const fieldsParam = JSON.stringify(fields);
    let url = `${baseUrl}api/resource/${doctype}?limit_page_length=500&fields=${fieldsParam}`;
    if (filters.length > 0) {
      url += `&filters=${JSON.stringify(filters)}`;
    }
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        map(res => res.data || []),
        catchError(err => {
          console.error(`Failed to fetch ${doctype}`, err);
          return of([]);
        })
      );
  }

  // Deprecated in favor of fetchDocTypeList
  fetchLanguages(): void {
    this.fetchDocTypeList('Language', ['name', 'language_name']).subscribe(data => this.languages = data);
  }

  get cf() {
    return this.sellerForm.controls;
  }

  get accounts(): FormArray {
    return this.sellerForm.get('accounts') as FormArray;
  }

  get portalUsers(): FormArray {
    return this.sellerForm.get('portal_users') as FormArray;
  }

  addAccountRow(): void {
    this.accounts.push(this.fb.group({
      company: ['', Validators.required],
      default_account: ['']
    }));
  }

  removeAccountRow(index: number): void {
    this.accounts.removeAt(index);
  }

  addPortalUserRow(): void {
    this.portalUsers.push(this.fb.group({
      user: ['', [Validators.required, Validators.email]]
    }));
  }

  removePortalUserRow(index: number): void {
    this.portalUsers.removeAt(index);
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.sellerForm.invalid) {
      this.sellerForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields correctly.';
      this.toastService.showError(this.errorMessage);
      return;
    }

    const payload = this.sellerForm.getRawValue();
    
    this.loading = true;

    this.authService.registerSeller(payload)
      .then((res) => {
        this.toastService.showSuccess('Seller registered successfully!');
        this.successMessage = 'Seller registration successful!';
        this.sellerForm.reset({
          language: 'en',
          send_welcome_email: true
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      })
      .catch((err) => {
        console.error('[SellerReg] Error creating seller:', err);
        
        let serverMessage = '';
        if (err.error?._server_messages) {
          try {
            const messages = JSON.parse(err.error._server_messages);
            serverMessage = messages.map((m: string) => {
              const parsed = JSON.parse(m);
              return parsed.message;
            }).join(' | ');
          } catch (e) {
            serverMessage = err.error._server_messages;
          }
        } else if (err.error?.exception) {
          serverMessage = err.error.exception;
        }

        this.errorMessage = serverMessage || err.error?.message || err.message || 'Failed to register seller.';
        this.toastService.showError(this.errorMessage);
      })
      .finally(() => this.loading = false);
  }
}
