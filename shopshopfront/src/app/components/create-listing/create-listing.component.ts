import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {AuthService} from "../../services/auth.service";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.css']
})
export class CreateListingComponent implements OnInit {

  createListingForm!: FormGroup;

  imageFile: {file: any; link: any; name: any} | undefined;

  price!: number;
  description!: string;
  title!: string;

  constructor(private domSanitizer: DomSanitizer, private authService: AuthService, private productService: ProductService) { }

  ngOnInit(): void {
    this.createListingForm = new FormGroup({
      title : new FormControl(this.title,Validators.compose([Validators.required,  Validators.minLength(5)])),
      description : new FormControl(this.description,Validators.compose([Validators.required, Validators.minLength(5)])),
      price : new FormControl(this.price, [Validators.required, Validators.min(0)]),
      thumbnail : new FormControl(null, Validators.required)
    });
  }


  imagesPreview(e : any) {
    if (e.target.files && e.target.files[0]) {
        this.imageFile = {
          link: this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(e.target.files[0])),
          file: e.target.files[0],
          name: e.target.files[0].name
        };
    }
  }

  createListing(){
    if(this.createListingForm.invalid)
      return;

    const photo = this.imageFile?.file as File;
    const price = this.createListingForm.get('price')?.value as string;
    const title = this.createListingForm.get('title')?.value as string;
    const description = this.createListingForm.get('price')?.value as string;
    const seller_id = this.authService.getId();

    let formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('photo', photo);
    formData.append('title', title);
    formData.append('seller', seller_id);

    this.productService.createProduct(formData).subscribe({
      error: err => console.error(err),
      complete: () => {}
    })
  }

}
