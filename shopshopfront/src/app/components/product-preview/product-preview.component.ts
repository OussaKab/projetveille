import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {CartItemService} from "../../services/cart-item.service";

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.css']
})
export class ProductPreviewComponent implements OnInit {

  @Input()
  product!: Product;

  price: number = 0;
  title: string ='';
  description : string = '';
  imageUrl!: SafeUrl;
  imageAlt = '';

  constructor(private domSanitizer: DomSanitizer, private router: Router, private cartItemService: CartItemService) { }

  ngOnInit(): void {
    this.price = this.product.price;
    this.title = this.product.title;
    this.imageUrl = this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.product.photo));
    this.description = this.product.description;
    this.imageAlt = this.product.title;
  }

  addToCart(title: string) {
    this.cartItemService.addProduct(title).subscribe({
      next: value => console.log(value),
      error: err => console.error(err),
      complete: () => alert(`added '${title}' to cart!`)
    });
  }
}
