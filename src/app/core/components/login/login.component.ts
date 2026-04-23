import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LoginRequest } from 'src/app/shared/services/auth/auth.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnDestroy {
  isLoading = false;
  errorMessage = '';
  loginForm!: FormGroup;
  private destroy$ = new Subject<void>();

  // Custom validator to accept both email and plain username
  private emailOrUsernameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    
    // Check if it's a valid email OR a plain username (at least 3 characters)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(value);
    const isValidUsername = value.length >= 3 && /^[a-zA-Z0-9_.]+$/.test(value);
    
    return isValidEmail || isValidUsername ? null : { invalidEmailOrUsername: true };
  }

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        this.emailOrUsernameValidator.bind(this)
      ]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    // Clear error message when user starts typing
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.errorMessage = '';
      });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter a valid email/username and password (min. 6 characters)';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            // Navigation is handled in AuthService
            this.loginForm.reset();
          } else {
            this.errorMessage = response.message || 'Login failed. Please try again.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error?.error?.message || 'Login failed. Please try again.';
          console.error('Login error:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

