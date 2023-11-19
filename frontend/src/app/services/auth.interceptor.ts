import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private user: UserService
  ) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = this.user.getToken();
    if (token) {
      let clone = req.clone({ headers: req.headers.set('x-access-token', this.user?.getToken() ?? '') });
      console.log("let clone:", clone)
      return next.handle(clone);
    } else {
      return next.handle(req);
    }
  }
}
