import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
// @ts-ignore
import * as Swal from "sweetalert2/dist/sweetalert2.all.js";
import {Router} from "@angular/router";
import {HttpUtilities} from "../../services/http-utilities";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  private subscriptions : Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, HttpUtilities.noWhitespaceValidator]),
      password: new FormControl('', [Validators.required, HttpUtilities.noWhitespaceValidator])
    })
  }

  public login(): void{
    if(!this.form.valid) {
      alert('Error when logging in');
    }

    const username = this.form.get('username')?.value as string;
    const password = this.form.get('password')?.value as string;

    this.subscriptions.push(this.authService.login({username, password})
      .subscribe({
        next : data => AuthService.storeToken(data),
        error : err =>  console.error(err),
        complete: () => this.router.navigateByUrl('/home')
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
