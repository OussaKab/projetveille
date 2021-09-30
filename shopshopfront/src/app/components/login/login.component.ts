import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
// @ts-ignore
import * as Swal from "sweetalert2/dist/sweetalert2.all.js";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  private subscriptions : Subscription[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required])
    })
  }

  public login(): void{
    if(!this.form.valid) {
      Swal.fire({
        title: 'Error when login in',
        text: 'Check if all fields are filled',
        icon: 'warning'
      });
    }
    const username = this.form.get('username')?.value as string;
    const password = this.form.get('password')?.value as string;
    this.subscriptions.push(this.authService.login({username, password}));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
