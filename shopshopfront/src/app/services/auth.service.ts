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



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  login(loginRequest: LoginRequest): Observable<JwtToken>{
    return this.http.post<JwtToken>(`${environment.authUrl}/login`, JSON.stringify(loginRequest), HttpUtilities.jsonHttpOptions).pipe(
      retry(2),
      shareReplay(1)
    );
  }

  public getJwt(): string {
    return localStorage.getItem('token') || "";
  }

  public getCurrentUser(): UserDTO {
    return <UserDTO>(!this.isLoggedIn() ? null : this.getCitizenDecoded(this.getJwt()));
  }

  private getCitizenDecoded(token: string): UserDTO{
    const decodedToken = HttpUtilities.jwtHelper.decodeToken(token);

    const user: UserDTO = new UserDTO();
    user.firstName = decodedToken.firstName;
    user.lastName = decodedToken.lastName;
    user.email = decodedToken.email;
    user.username = decodedToken.sub;
    user.dateJoined = decodedToken.dateJoined;
    user.lastLogin = decodedToken.lastLogin;
    user.roles = decodedToken.roles;

    return user;
  }

  public disconnect(): Subscription{
    if (localStorage.getItem('token')){
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
