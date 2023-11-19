import {
    CanActivate,
    CanActivateChild,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    UrlTree
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SingletonService } from "./singleton.service";
import { UserService } from "./user.service";

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
    constructor(
        private ss: SingletonService,
        private router: Router,
        private user: UserService
    ) { }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        throw new Error("Method not implemented.");
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | Promise<boolean> {
        let userIsValid = false;
        userIsValid = this.user.getToken() ? true : false
        console.log("userisvalid:", userIsValid)
        if (userIsValid) {
            // this.router.navigate(['/home']);
            return true
        } else {
            this.router.navigate(['/login']);
            return false

        }
    }

}
@Injectable()
export class AuthGuardSecurityService_Admin implements CanActivate {

    constructor(
      private router: Router,
      private user: UserService
    ) { }
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
  
        let is_hr =  this.user.getIsAdmin()
        let dashbaord_route = '/dashobard'
        if (is_hr) {
            return true;
        } else {
            this.router.navigate([dashbaord_route], {
            });
            return false;
        }
    }
  }