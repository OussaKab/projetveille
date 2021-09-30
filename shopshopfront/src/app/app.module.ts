import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ErrorComponent } from './components/error/error.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { ShippingCartComponent } from './components/cart/shipping-cart.component';
import { CreateListingComponent } from './components/create-listing/create-listing.component';
import { LoginComponent } from './components/login/login.component';
import {ShopShopInterceptor} from "./services/shop-shop-interceptor.service";
import { ProductPreviewComponent } from './components/product-preview/product-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ErrorComponent,
    SignupComponent,
    HomeComponent,
    ShippingCartComponent,
    CreateListingComponent,
    LoginComponent,
    ProductPreviewComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: ShopShopInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
