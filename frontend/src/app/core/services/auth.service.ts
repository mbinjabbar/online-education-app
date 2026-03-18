import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login.model';
import { SignupResponse } from '../models/signup.model';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.api.auth;
  private http = inject(HttpClient);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password });
  }

  signup(formData: FormData): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.baseUrl}/signup`, formData);
  }

  private get storage(): Storage {
    return localStorage.getItem('rememberMe') === 'true'
      ? localStorage
      : sessionStorage;
  }

  setSession(token: string, user: User, rememberMe: boolean = false): void {
    if (rememberMe) localStorage.setItem('rememberMe', 'true');
    this.storage.setItem('token', token);
    this.storage.setItem('user', JSON.stringify(user));
  }

  updateUser(user: User): void {
    this.storage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) as User : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  private decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return false;

    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      this.clearSession();
      return false;
    }

    return true;
  }

  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }
}