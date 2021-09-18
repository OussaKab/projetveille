import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  token: string | undefined;
  title: string = AppComponent.title;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.token = this.authService.getJwt();
  }

  logoff(): void {
    this.authService.disconnect()
  }
}
