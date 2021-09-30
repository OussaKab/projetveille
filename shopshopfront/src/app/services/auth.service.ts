import { environment } from './../../environments/environment';
import { SignupRequest } from './../models/signup-request';
import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Subscription} from 'rxjs';
import { JwtToken } from '../models/jwt-token';
import {retry, shareReplay} from 'rxjs/operators';
import {HttpUtilities} from './http-utilities';
import {LoginRequest} from '../models/login-request';
import {UserDTO} from "../models/user-dto";
// @ts-ignore
import * as Swal from 'sweetalert2/dist/sweetalert2.all.js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.authUrl;

  constructor(private http: HttpClient) {}

  public login(loginCredentials: LoginRequest): Subscription{
    return this.http.post<JwtToken>(`${this.url}/login`, JSON.stringify(loginCredentials), HttpUtilities.jsonHttpOptions).pipe(
      retry(2),
      shareReplay(1)
    ).subscribe({
      next: data => this.storeToken(data),
      error: err => Swal.fire({ text: err.error, icon: 'error'})
    });
  }

  public signup(s: SignupRequest): Subscription{
    return this.http.post<JwtToken>(`${this.url}/signup`, JSON.stringify(s), HttpUtilities.jsonHttpOptions).pipe(
      retry(2),
      shareReplay(1)
    ).subscribe({
      next: (tokens) => this.storeToken(tokens),
      error: err => {
        if(err.hasOwnProperty('error')){
          Swal.fire({text: err.error + '!', icon: 'error'})
        }
      }
    });
  }

  public isLoggedIn(): boolean{
    const token = this.getJwt();
    return !!token && !HttpUtilities.jwtHelper.isTokenExpired(token);
  }

  public disconnect(): Subscription{
    if (localStorage.getItem('token') !== undefined){
      localStorage.removeItem('token');
    }

    return this.http.post(`${environment.authUrl}/logoff`, HttpUtilities.jsonHttpOptions).subscribe();
  }

  public refreshToken(): Subscription {
    return this.http.post<JwtToken>(
      `${this.url}/token-refresh`,
          JSON.stringify({token: this.getRefreshJwt()}),
          HttpUtilities.jsonHttpOptions)
    .subscribe({
      next : data => this.storeToken(data),
      error : err =>  {
        if(err.hasOwnProperty('error')) {
          Swal.fire({text: err.error, icon: 'error'})
        }else{
          console.error(JSON.stringify(err));
        }
      }
    });
  }

  private storeToken(data: {refresh: string, access: string}): void {
    localStorage.setItem('token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    const token_parts = data.access.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
  }

  public getJwt(): string {
    return localStorage.getItem('token') || "";
  }

  public getCurrentUser(): UserDTO {
    return <UserDTO>(!this.isLoggedIn() ? null : this.getCitizenDecoded(this.getJwt()));
  }

  private getCitizenDecoded(token: string): UserDTO{
    const decodedToken = HttpUtilities.jwtHelper.decodeToken(token);

    return {
      firstName: decodedToken.firstName,
      lastName: decodedToken.lastName,
      email : decodedToken.email,
      username: decodedToken.username,
      dateJoined: decodedToken.dateJoined,
      lastLogin: decodedToken.lastLogin,
      roles: decodedToken.roles
    }
  }

  private getRefreshJwt() {
    return localStorage.getItem('refresh_token') || "";
  }
}
