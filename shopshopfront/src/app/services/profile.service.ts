import { Injectable } from '@angular/core';
import {UserDTO} from "../models/user-dto";
import {HttpClient} from "@angular/common/http";
import {HttpUtilities} from "./http-utilities";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public user: UserDTO | null = null;

  constructor(private http: HttpClient) {
  }

}
