import {Injectable} from "@angular/core";
import {HttpInterceptor, HttpHandler, HttpRequest, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs";
import {HttpUtilities} from "./http-utilities";
import {AuthService} from "./auth.service";

@Injectable()
export class ShopShopInterceptor implements HttpInterceptor{

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.auth.isLoggedIn()){
      request = request.clone({
        setHeaders: {
          Authorization : `${HttpUtilities.JWT_HEADER} ${this.auth.getJwt()}`
        }
      })
    }
    return next.handle(request);
  }

}
