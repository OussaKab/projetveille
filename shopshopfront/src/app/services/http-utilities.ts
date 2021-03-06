
import {FormControl, Validators} from '@angular/forms';
import {HttpHeaders} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';

// tslint:disable-next-line:no-namespace
export namespace HttpUtilities{
  export function noWhitespaceValidator(control: FormControl): {} {
    const isWhitespace: boolean = (control.value || '').trim().length === 0;
    // @ts-ignore
    return !isWhitespace ? null : { whitespace: true };
  }

  export const jsonHttpOptions = {headers : new HttpHeaders({'content-type': 'application/json'})};

  export const blobHeaders = {headers : new HttpHeaders({'content-type': 'application/json', responseType: 'blob'}), responseType: 'blob' as 'json'};

  export const jwtHelper = new JwtHelperService();

  export const JWT_HEADER = 'Bearer';

  export const PASSWORD_VALIDATORS =  [
    HttpUtilities.noWhitespaceValidator,
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(30)
  ];
}
