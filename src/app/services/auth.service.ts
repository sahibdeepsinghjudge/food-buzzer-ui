import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';

  constructor(private router: Router) { }

  login(email: string, password: string): Observable<LoginResponse> {
    // Mock API call for login
    if (email === 'admin@foodbuzzer.com' && password === 'admin123') {
      return of({
        token: 'mock-jwt-token-12345',
        user: {
          id: 1,
          email: 'admin@foodbuzzer.com',
          name: 'Admin User'
        }
      }).pipe(
        delay(1000),
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        })
      ); // Simulate network delay
    } else {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
    }
  }

  register(step1Data: any, step2Data: any): Observable<RegisterResponse> {
    // Mock API call for registration
    console.log('Registering user with data:', { step1Data, step2Data });
    return of({
      success: true,
      message: 'Registration successful'
    }).pipe(
      delay(1500),
      tap(response => {
        if (response.success) {
          // Auto-login newly registered users with a mock token
          localStorage.setItem(this.TOKEN_KEY, 'mock-jwt-token-registered-456');
        }
      })
    ); // Simulate network delay
  }

  isAuthenticated(): boolean {
    // In a real app we might decode the JWT or verify expiration.
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/accounts/login']);
  }
}
