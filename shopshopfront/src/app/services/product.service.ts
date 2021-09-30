import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product} from "../models/product";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService{
  constructor(private http: HttpClient) {}
  url = `${environment.baseUrl}/products/`;

  createProduct(formData: FormData): Observable<unknown>{
    return this.http.post(this.url, formData);
  }

  findAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }
}
