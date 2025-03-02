import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse } from '../models/auth-response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:1337/api'; // Replace with your API URL
  private authStateSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public authStateChanged = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Login
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/local`, {
      identifier: email,
      password,
    }).pipe(
      tap(response => {
        this.authStateSubject.next(true);
      })
    );
  }

  // Signup
  signup(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/local/register`, user).pipe(
      tap(response => {
        this.authStateSubject.next(true);
      })
    );
  }

  // Logout
  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    this.authStateSubject.next(false);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }

  // Get current user from storage
  getCurrentUser(): any {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  // Get JWT token
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }
}