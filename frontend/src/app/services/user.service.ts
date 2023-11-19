

import { SingletonService } from "./singleton.service";
import { Router, NavigationStart } from "@angular/router";
import { Injectable, ViewChild } from "@angular/core";
import { Observable, Subject, BehaviorSubject, Observer } from "rxjs";
import { HttpResponse } from "@angular/common/http";

@Injectable()
export class UserService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = new Subject();
  private userName = new BehaviorSubject('');
  user = this.userName.asObservable();
  private notifyCount = new BehaviorSubject('');
  notificationCount = this.notifyCount.asObservable();


  constructor(
    private router: Router,
    private ss: SingletonService
  ) { }


  logoutOnExpiry() {
    this.logout();
    this.router.navigate(['login']);
  }

  getRoutePrefix() {
    return  this.getIsAdmin() ? '/dashboard' : '/chat-home';
  }

  getToken() {
    return localStorage.getItem("token");
  }
  getRoleId() {
    return this.getTokenPayload()["role_id"];
  }
  getSessionExpiry() {
    return this.getTokenPayload()["exp"];
  }

  getName() {
    let fullName = this.getTokenPayload()["name"];
    return fullName;
  }
  getUserName() {
    let payLoad = this.getTokenPayload();
    this.userName.next(payLoad["username"])
    return payLoad["username"];
  }
  getDataFromToken(key: any) {
    return this.getTokenPayload()[key];
  }
  getIsAdmin() {
    let isAdmin = this.getTokenPayload()["is_admin"];
    return isAdmin

  }

  // check if the expiration of token is valid.
  validateSession() {
    // return true;
    if (localStorage?.getItem("token")) {
      let timeStamp = this.getDataFromToken("exp") * 1000;
      var diff = parseInt(localStorage?.getItem("timeDiff") ?? '0', 10);
      let now = Date.now();
      let boolean: boolean = timeStamp > now;
      this.ss.loggedIn$.next(boolean);
      this.ss.isPreSignIn$.next(!boolean);
      return boolean;
    } else {
      this.ss.loggedIn$.next(false);
      this.ss.isPreSignIn$.next(true);

      return false;
    }
  }

  // remove the user meta data in the local storage
  resetSession() {
    localStorage.removeItem("token");
    //console.log(this.getRole());
  }

  public reloadOnLogout: any;

  logout(
    reload: boolean = true) {
    let loginEndPoint;
    let role = this.getRoleId();
    this.ss.loggedIn$.next(false);
    // this.ss.isPreSignIn$.next(true);
    this.ss.sideBarToggle$.next(false);
    // reset the session
    this.resetSession();
    // this.router.navigate(["/login"])

    if (reload) {
      setTimeout(function () {
        window.location.replace('/login');
        // window.location.reload();
      });
    }
  }


  // get the payload from JWT   -- header.payload.signature
  getTokenPayload() {
    if (localStorage.getItem("token")) {
      // get the part of the token which can be base 64 decoded
      let payload = localStorage?.getItem("token")?.split(".")[1];
      // decode the payload
      let decoded = this.b64DecodeUnicode(payload);
      let parsed = JSON.parse(decoded);
      return parsed;
    } else {
      return false;
    }
  }


  // method to base64 decode the token to get decoded text ( should work with unicode text also )
  b64DecodeUnicode(str: any) {
    return decodeURIComponent(
      atob(str)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }

  b64EncodeUnicode(str: any) {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode(<any>"0x" + p1);
      })
    );
  }
}