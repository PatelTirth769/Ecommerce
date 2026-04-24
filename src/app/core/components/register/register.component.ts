import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: FirebaseAuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      pan: [''],
      aadhar: [''],
      address: [''],
      city: ['', Validators.required],
      pincode: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  async onSubmit() {
    this.errorMessage = '';
    
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      
      const invalidControls: string[] = [];
      const controls = this.registerForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalidControls.push(name);
        }
      }

      const fieldNames: Record<string, string> = {
        firstname: 'First Name',
        lastname: 'Last Name',
        email: 'Email',
        mobile: 'Mobile Number',
        pan: 'PAN Number',
        aadhar: 'Aadhaar Number',
        address: 'Address',
        city: 'City',
        pincode: 'Pincode',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        terms: 'Terms and Conditions'
      };

      const missingFields = invalidControls
        .map(key => fieldNames[key] || key)
        .join(', ');

      this.errorMessage = `Please fix the following fields: ${missingFields}`;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.registerBuyer(this.registerForm.value);
      // Registration successful, navigation handled in service
    } catch (error: any) {
      console.error(error);
      this.errorMessage = error.message || 'Failed to register. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
