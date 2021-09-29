import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.css']
})
export class CreateListingComponent implements OnInit {

  createListingForm: FormGroup = this.getForm();

  imageFile: {
    file: any;
    link: any;
    name: any
  } | undefined;

  constructor() { }

  private getForm() : FormGroup{
    return new FormGroup({
      title : new FormControl('',Validators.compose([Validators.required,  Validators.minLength(5)])),
      description : new FormControl('',Validators.compose([Validators.required, Validators.minLength(5)])),
      price : new FormControl(0, [Validators.required, Validators.min(0)])
    });
  }

  ngOnInit(): void {
  }

  imagesPreview(event : any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = ( e: any) => {
        this.imageFile = {
          link: e.target.result,
          file: e.target.files[0],
          name: e.target.files[0].name
        };
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
