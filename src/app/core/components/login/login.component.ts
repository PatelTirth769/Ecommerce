import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
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

  constructor(private formBuilder: FormBuilder, private authService: FirebaseAuthService) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.errorMessage = '';
      });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter a valid email and password (min. 6 characters)';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
      // Navigation is handled in service
    } catch (error: any) {
      console.error('Login error:', error);
      this.errorMessage = error.message || 'Login failed. Please check your credentials and try again.';
    } finally {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

