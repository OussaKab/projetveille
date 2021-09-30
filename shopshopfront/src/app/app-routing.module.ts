import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignupComponent} from "./components/signup/signup.component";
import {ErrorComponent} from "./components/error/error.component";
import {HomeComponent} from "./components/home/home.component";
import {CreateListingComponent} from "./components/create-listing/create-listing.component";
import {LoginComponent} from "./components/login/login.component";
import {ShippingCartComponent} from "./components/cart/shipping-cart.component";

const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'create-listing',
    component: CreateListingComponent
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'cart',
    component: ShippingCartComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/error',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
