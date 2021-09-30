import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product} from "../models/product";
import {GenericCrudService} from "./generic-crud.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService extends GenericCrudService<Product, number>{
  constructor(http: HttpClient) {
    super(http, `${environment.baseUrl}/products/`);
  }
}
