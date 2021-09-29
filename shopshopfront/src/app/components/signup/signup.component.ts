import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpUtilities} from "../../services/http-utilities";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  form: FormGroup | undefined;

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, HttpUtilities.noWhitespaceValidator]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
      password2: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }
}
