import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {CartItemService} from "../../services/cart-item.service";
import {ShoppingCart} from "../../models/ShoppingCart";

@Component({
  selector: 'app-shipping-cart',
  templateUrl: './shipping-cart.component.html',
  styleUrls: ['./shipping-cart.component.css']
})
export class ShippingCartComponent implements OnInit {
  shoppingCart!: ShoppingCart;

  constructor(private domSanitizer: DomSanitizer, private cartItemService: CartItemService) { }

  ngOnInit(): void {
    this.cartItemService.getShoppingCart().subscribe({
      next: cart => this.shoppingCart = cart,
      error: err => console.error(err),
      complete: () => console.log('Loaded all cart items!')
    })
  }

  resolveUrl(file: File) {
    return this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
  }

  checkout(){
    alert('Congratulations');
    this.cartItemService.checkout().subscribe({
      next: value => {},
      error: err => console.error(err),
      complete: () => alert('payed for all items! Congrats!')
    })
  }
}
