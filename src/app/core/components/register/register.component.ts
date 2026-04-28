import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: FirebaseAuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      username: [''],
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      language: ['English'],
      time_zone: ['Asia/Kolkata'],
      send_welcome_email: [true],
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
        first_name: 'First Name',
        last_name: 'Last Name',
        email: 'Email',
        mobile: 'Mobile Number',
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
      this.toastService.showSuccess('Registration successful! Please login.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error(error);
      
      let serverMessage = '';
      if (error.error?._server_messages) {
        try {
          const messages = JSON.parse(error.error._server_messages);
          serverMessage = messages.map((m: string) => JSON.parse(m).message).join(' | ');
        } catch (e) {
          serverMessage = error.error._server_messages;
        }
      }

      this.errorMessage = serverMessage || error.error?.message || error.message || 'Failed to register. Please try again.';
      this.toastService.showError(this.errorMessage);
    } finally {
      this.isLoading = false;
    }
  }
}
