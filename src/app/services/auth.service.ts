import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token?: string;
  token?: string;
  accessToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'access_token';
  private tokenSignal = signal<string | null>(this.readToken());

  // Adjust to match your backend base URL
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { username, password };
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, body).pipe(
      tap((resp) => {
        const token = resp.access_token || resp.token || resp.accessToken;
        if (token) {
          this.setToken(token);
        }
      })
    );
  }

  logout(): void {
    this.clearToken();
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  isAuthenticated(): boolean {
    return !!this.tokenSignal();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.tokenSignal.set(token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.tokenSignal.set(null);
  }

  private readToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}