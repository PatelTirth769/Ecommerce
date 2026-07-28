import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  // Step 1: enter email
  // Step 2: enter new + confirm password
  step: 'email' | 'reset' = 'email';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showNewPassword = false;
  showConfirmPassword = false;

  emailForm: FormGroup;
  resetForm: FormGroup;

  private verifiedEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: FirebaseAuthService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.resetForm = this.fb.group({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator });

    this.emailForm.valueChanges.subscribe(() => { this.errorMessage = ''; });
    this.resetForm.valueChanges.subscribe(() => { this.errorMessage = ''; });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('newPassword')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return newPass === confirm ? null : { mismatch: true };
  }

  async onVerifyEmail(): Promise<void> {
    if (this.emailForm.invalid) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const email = this.emailForm.value.email.trim();
      const exists = await this.authService.checkUserExists(email);
      if (!exists) {
        this.errorMessage = 'No account found with this email address.';
        return;
      }
      this.verifiedEmail = email;
      this.step = 'reset';
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to verify email. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async onResetPassword(): Promise<void> {
    if (this.resetForm.invalid) {
      this.errorMessage = 'Please enter matching passwords (min. 8 characters).';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.resetPassword(this.verifiedEmail, this.resetForm.value.newPassword);
      this.successMessage = 'Password changed successfully! Redirecting to login...';
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to reset password. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
