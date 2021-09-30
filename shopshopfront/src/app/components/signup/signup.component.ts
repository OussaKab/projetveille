import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpUtilities} from "../../services/http-utilities";
import {SignupRequest} from "../../models/signup-request";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  private sub!: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, HttpUtilities.noWhitespaceValidator]),
      first_name: new FormControl('', [Validators.required, HttpUtilities.noWhitespaceValidator]),
      last_name: new FormControl('', [Validators.required, HttpUtilities.noWhitespaceValidator]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
      password2: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }


  signup(){
    if(!this.form.valid){
      return;
    }
    const username = this.form.get('username')?.value as string;
    const password = this.form.get('password')?.value as string;
    const password2 = this.form.get('password2')?.value as string;
    const email = this.form.get('email')?.value as string;
    const first_name = this.form.get('first_name')?.value as string;
    const last_name = this.form.get('last_name')?.value as string;

    const signupRequest: SignupRequest = {first_name,last_name,  password, password2,username,email};
    this.sub = this.authService.signup(signupRequest);
    this.router.navigateByUrl('/home');
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
