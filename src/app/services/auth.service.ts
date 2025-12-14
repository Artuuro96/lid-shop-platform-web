import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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
  private readonly baseUrl = 'https://auth.lid-shop.com/realms/lid-shop/protocol/openid-connect';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', 'password')
      .set('client_id', 'lid-shop-platform')
      .set('client_secret', 'P96QuHABA9Q5dIY8NTcBEdZQZIYvMwer')
    
    return this.http.post<LoginResponse>(`${this.baseUrl}/token`, body.toString(), { headers }).pipe(
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