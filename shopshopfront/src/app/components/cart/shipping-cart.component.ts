import { Component, OnInit } from '@angular/core';
import {CartItem} from "../../models/cart-item";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-shipping-cart',
  templateUrl: './shipping-cart.component.html',
  styleUrls: ['./shipping-cart.component.css']
})
export class ShippingCartComponent implements OnInit {
  cartitems: CartItem[] = [];

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  resolveUrl(file: File) {
    return this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
  }
}
