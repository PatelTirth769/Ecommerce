import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { finalize, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SellerRegistrationService } from 'src/app/shared/services/seller-registration.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

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
    { id: 'details', label: 'Details' },
    { id: 'tax', label: 'Tax' },
    { id: 'address', label: 'Address & Contact' },
    { id: 'accounting', label: 'Accounting' },
    { id: 'settings', label: 'Settings' },
    { id: 'portal', label: 'Portal Users' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly sellerService: SellerRegistrationService,
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.sellerForm = this.fb.group({
      supplier_name: ['', Validators.required],
      supplier_group: [''],
      country: ['India'],
      supplier_type: ['Company', Validators.required],
      is_transporter: [false],
      default_currency: [''],
      default_price_list: [''],
      default_bank_account: [''],
      is_internal_supplier: [false],
      represents_company: [''],
      supplier_details: [''],
      website: [''],
      language: ['en'],
      // Tax
      tax_id: [''],
      tax_category: [''],
      tax_withholding_category: [''],
      // Address & Contact
      supplier_primary_address: [''],
      supplier_primary_contact: [''],
      // Accounting
      default_payment_terms_template: [''],
      accounts: this.fb.array([]),
      // Settings
      allow_purchase_invoice_creation_without_purchase_order: [false],
      allow_purchase_invoice_creation_without_purchase_receipt: [false],
      is_frozen: [false],
      disabled: [false],
      block_supplier: [false],
      hold_type: [''],
      release_date: [''],
      // Portal Users
      portal_users: this.fb.array([])
    });

    this.sellerForm.get('is_internal_supplier')?.valueChanges.subscribe(checked => {
      const representsControl = this.sellerForm.get('represents_company');
      if (checked) {
        representsControl?.setValidators([Validators.required]);
      } else {
        representsControl?.clearValidators();
      }
      representsControl?.updateValueAndValidity();
    });

    this.fetchAllDropdownData();
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
    
    // convert boolean to 1/0 for ERPNext
    payload.is_transporter = payload.is_transporter ? 1 : 0;
    payload.is_internal_supplier = payload.is_internal_supplier ? 1 : 0;
    payload.allow_purchase_invoice_creation_without_purchase_order = payload.allow_purchase_invoice_creation_without_purchase_order ? 1 : 0;
    payload.allow_purchase_invoice_creation_without_purchase_receipt = payload.allow_purchase_invoice_creation_without_purchase_receipt ? 1 : 0;
    payload.is_frozen = payload.is_frozen ? 1 : 0;
    payload.disabled = payload.disabled ? 1 : 0;
    payload.block_supplier = payload.block_supplier ? 1 : 0;

    this.loading = true;

    this.sellerService.createSupplier(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          this.toastService.showSuccess('Supplier registered successfully!');
          this.successMessage = 'Supplier registration successful!';
          this.sellerForm.reset({
            country: 'India',
            supplier_type: 'Company',
            is_transporter: false,
            is_internal_supplier: false,
            language: 'en'
          });
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        },
        error: (err) => {
          console.error('[SellerReg] Error creating supplier:', err);
          
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

          this.errorMessage = serverMessage || err.error?.message || err.message || 'Failed to register supplier.';
          this.toastService.showError(this.errorMessage);
        }
      });
  }
}
