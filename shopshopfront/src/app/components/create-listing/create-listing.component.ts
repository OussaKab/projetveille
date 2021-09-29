import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.css']
})
export class CreateListingComponent implements OnInit {

  createListingForm!: FormGroup;

  imageFile: {file: any; link: any; name: any} | undefined;

  post: { title: string, price: number, description: string} | undefined;

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.createListingForm = new FormGroup({
      title : new FormControl('',Validators.compose([Validators.required,  Validators.minLength(5)])),
      description : new FormControl('',Validators.compose([Validators.required, Validators.minLength(5)])),
      price : new FormControl(0, [Validators.required, Validators.min(0)]),
      thumbnail : new FormControl(null, Validators.required)
    });
  }

  imagesPreview(e : any) {
    let title = this.createListingForm?.get('title')?.value as string;
    let description = this.createListingForm?.get('description')?.value as string;
    let price = this.createListingForm?.get('price')?.value as number;

    this.post = {title, description, price};

    if (e.target.files && e.target.files[0]) {
        this.imageFile = {
          link: this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(e.target.files[0])),
          file: e.target.files[0],
          name: e.target.files[0].name
        };
    }
  }

}
