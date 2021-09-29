import { environment } from './../../environments/environment';
import { SignupRequest } from './../models/signup-request';
import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Subscription, Observable, of} from 'rxjs';
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

  constructor(private http: HttpClient, private router: Router) {}

  errors = [];

  public login(loginCredentials: LoginRequest): void {
    this.http.post<JwtToken>(`${environment.authUrl}/login`, JSON.stringify(loginCredentials), HttpUtilities.jsonHttpOptions).pipe(
      retry(2),
      shareReplay(1)
    ).subscribe({
      next: data => this.storeToken(data.token),
      error: err => Swal.fire({ text: err.error, icon: 'error'})
    });
  }

  public refreshToken(): void {
    this.http.post(`${environment.authUrl}/token-refresh`, JSON.stringify({token: this.getJwt()}), HttpUtilities.jsonHttpOptions).subscribe(
      (data:any) => {
        if(data && data.hasOwnProperty('token')){
          this.storeToken(data.token)
        }
      },
      err =>  {
        if(err.hasOwnProperty('error')) {
          Swal.fire({text: err.error, icon: 'error'})
        }
      }
    );
  }

  private storeToken(token: string) {
    localStorage.setItem(HttpUtilities.JWT_HEADER, token);
    const token_parts = token.split(/\./);
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

  public disconnect(): Subscription{

    if (localStorage.getItem('token') !== undefined){
      localStorage.removeItem('token');
    }

    return this.http.post(`${environment.authUrl}/logoff`, HttpUtilities.jsonHttpOptions).subscribe();
  }

  public isLoggedIn(): boolean{
    const token = this.getJwt();
    return !!token && !HttpUtilities.jwtHelper.isTokenExpired(token);
  }

  public signup(s: SignupRequest): Observable<JwtToken>{
    return this.http.post<JwtToken>(`${environment.authUrl}/signup`, JSON.stringify(s), HttpUtilities.jsonHttpOptions).pipe(
      retry(2)
    );
  }
}
