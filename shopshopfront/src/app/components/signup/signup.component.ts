import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpUtilities} from "../../services/http-utilities";
import {Type} from "../../models/type";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  form: FormGroup = this.getForm();
  usertypes = Object.values(Type);

  constructor() { }

  ngOnInit(): void {
  }

  private getForm(): FormGroup{
    return new FormGroup({
      username: new FormControl('', [Validators.required, HttpUtilities.noWhitespaceValidator]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30), HttpUtilities.noWhitespaceValidator]),
      email: new FormControl('', [Validators.required, Validators.email]),
      type: new FormControl('', [Validators.required]),
    });
  }

}
