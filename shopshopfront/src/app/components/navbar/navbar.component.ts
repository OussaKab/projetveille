import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {AppComponent} from "../../app.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  token: string | undefined;
  title: string = AppComponent.title;
  searchForm!: FormGroup;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.token = AuthService.getJwtToken();
    this.searchForm = new FormGroup({
      search_input : new FormControl('', [Validators.required, Validators.minLength(1)])
    })
  }

  logoff(): void {
    this.authService.disconnect()
    alert('disconnected!')
    this.router.navigateByUrl('/login');
  }
}
