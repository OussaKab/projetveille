import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product";

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
  imageUrl = '';
  imageAlt = '';

  constructor() { }

  ngOnInit(): void {

  }

}
