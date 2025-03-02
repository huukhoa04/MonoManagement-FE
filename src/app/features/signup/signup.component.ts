import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  signupError: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
    
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
  
  // Custom validator to check if password and confirm password match
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  
  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.signupError = null;
      
      const user = {
        username: this.signupForm.get('username')?.value,
        email: this.signupForm.get('email')?.value,
        password: this.signupForm.get('password')?.value
      };
      
      this.authService.signup(user)
        .pipe(
          catchError(error => {
            console.error('Signup error:', error);
            
            if (error.error && error.error.message) {
              if (Array.isArray(error.error.message)) {
                this.signupError = error.error.message[0].messages[0].message;
              } else {
                this.signupError = error.error.message;
              }
            } else if (error.status === 0) {
              this.signupError = 'Unable to connect to the server. Please check your internet connection.';
            } else {
              this.signupError = 'An unexpected error occurred. Please try again later.';
            }
            
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe(response => {
          if (response) {
            // Store JWT token
            localStorage.setItem('jwt', response.jwt);
            
            // Store user info in session storage
            sessionStorage.setItem('user', JSON.stringify(response.user));
            
            // Navigate to home page
            this.router.navigate(['/']);
          }
        });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.get(key)?.markAsTouched();
      });
    }
  }
}