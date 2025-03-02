import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
    
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = null;
      
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      const rememberMe = this.loginForm.get('rememberMe')?.value;

      this.authService.login(email, password)
        .pipe(
          catchError(error => {
            console.error('Login error:', error);
            // Handle different error types
            if (error.status === 400) {
              this.loginError = 'Invalid email or password';
            } else if (error.status === 0) {
              this.loginError = 'Unable to connect to the server. Please check your internet connection.';
            } else {
              this.loginError = 'An unexpected error occurred. Please try again later.';
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
            
            // If remember me is checked, store user info
            if (rememberMe) {
              localStorage.setItem('user', JSON.stringify(response.user));
            } else {
              // Use sessionStorage if not remembering
              sessionStorage.setItem('user', JSON.stringify(response.user));
            }
            
            // Navigate to home page or intended destination
            this.router.navigate(['/']);
          }
        });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}