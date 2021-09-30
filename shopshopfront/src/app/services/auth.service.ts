import { environment } from '../../environments/environment';
import { SignupRequest } from '../models/signup-request';
import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import { JwtToken } from '../models/jwt-token';
import {retry, shareReplay} from 'rxjs/operators';
import {HttpUtilities} from './http-utilities';
import {LoginRequest} from '../models/login-request';
// @ts-ignore
import * as Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.authUrl;

  constructor(private http: HttpClient) {}

  public login(loginCredentials: LoginRequest): Observable<JwtToken>{
    return this.http.post<JwtToken>(`${this.url}/token/`, JSON.stringify(loginCredentials), HttpUtilities.jsonHttpOptions).pipe(
      retry(2),
      shareReplay(1)
    );
  }

  public signup(s: SignupRequest): Observable<JwtToken>{
    return this.http.post<JwtToken>(`${this.url}/signup/`, JSON.stringify(s), HttpUtilities.jsonHttpOptions).pipe(
      retry(2),
      shareReplay(1)
    );
  }

  public isLoggedIn(): boolean{
    const access_token = AuthService.getJwtToken();
    const refresh_token = AuthService.getRefreshJwtToken();
    return !!refresh_token && !!access_token && !HttpUtilities.jwtHelper.isTokenExpired(access_token);
  }

  public disconnect(): Subscription{
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');

    return this.http.post(`${environment.authUrl}/logout/`, HttpUtilities.jsonHttpOptions).subscribe();
  }

  public refreshToken(): Observable<JwtToken> {
    return this.http.post<JwtToken>(
      `${this.url}/token-refresh/`,
          JSON.stringify({token: AuthService.getRefreshJwtToken()}),
          HttpUtilities.jsonHttpOptions);
  }

  public static storeToken(data: {refresh: string, access: string}): void {
    localStorage.setItem('token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
  }

  public static getJwtToken(): string {
    return localStorage.getItem('token') || "";
  }

  private static getRefreshJwtToken() {
    return localStorage.getItem('refresh_token') || "";
  }

  public getJwt(): any{
    return HttpUtilities.jwtHelper.decodeToken(AuthService.getJwtToken());
  }

  getId(): string {
    return this.getJwt().user_id as string;
  }
}
