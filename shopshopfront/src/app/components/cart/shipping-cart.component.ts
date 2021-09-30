import { Component, OnInit } from '@angular/core';
import {CartItem} from "../../models/cart-item";

@Component({
  selector: 'app-shipping-cart',
  templateUrl: './shipping-cart.component.html',
  styleUrls: ['./shipping-cart.component.css']
})
export class ShippingCartComponent implements OnInit {
  cartitems!: CartItem[];

  constructor() { }

  ngOnInit(): void {
  }

}
