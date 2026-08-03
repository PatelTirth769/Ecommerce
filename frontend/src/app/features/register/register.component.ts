import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: FirebaseAuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      username: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      send_welcome_email: [true],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onMobileKeyPress(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only numeric digits
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
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
        confirmPassword: 'Confirm Password'
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
      
      if (this.errorMessage.toLowerCase().includes('password')) {
        const passControl = this.registerForm.get('password');
        if (passControl) {
          passControl.setErrors({ serverError: this.errorMessage });
          passControl.markAsTouched();
        }
        this.errorMessage = 'Please fix the error in the password field.';
      } else {
        this.toastService.showError(this.errorMessage);
      }
    } finally {
      this.isLoading = false;
    }
  }
}
