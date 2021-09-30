import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {HttpUtilities} from "./http-utilities";

@Injectable({
  providedIn: 'root'
})
export class CartItemService {

  private url = `${environment.baseUrl}/cart_items/`

  constructor(private http: HttpClient) { }

  addProduct(title: string): Observable<any> {
    return this.http.post(`${this.url}/`, JSON.stringify({'title': title}), HttpUtilities.jsonHttpOptions);
  }
}
