import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { SingletonService } from 'src/app/services/singleton.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private user: UserService,
    private router: Router,
    private ss: SingletonService,
    private _notifications:NotificationsService,
    private socketService:SocketService
  ) { }

  loginForm = this.ss.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  ngOnInit(): void {
    if (!this.user.validateSession()) {
      this.user.resetSession();
      this.router.navigate(['/login'])
    } else {
      this.ss.isPreSignIn$.next(true);
      this.router.navigate(['/dashboard']);
    }
  }


  async onLoginClicked() {
    let email = this.loginForm.get('email')?.value;
    let password = this.loginForm.get('password')?.value;
    let payload = {
      email: email,
      password: password
    }
    const url = this.ss.baseUrl +  'auth/signin/';
    console.log("payloda is :", payload,url);
    this.http.post<any>(url, payload, {observe:'events'}).subscribe((res:any)=> {
      console.log("res ......", res)
      if (res.status == 200) {
        console.log("Result is :", res?.body?.accessToken);
        let token = res?.body?.accessToken;
        localStorage.setItem('token', token);
        this.ss.isPreSignIn$.next(false);
        const routePrefix = this.user.getRoutePrefix();
        this.router.navigate([routePrefix]);
        this._notifications.success('Login Success!', 'Successfully Login', {
          timeOut: 3000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true
        });
        setTimeout(()=>{
          this.socketService.initializeSocket();
        },3000)
      } else if (res.status == 403) {
        console.log('user is notvalid', res);
        let errMsg = res.error.message;
       
      }
      else if (res.status == 404 || res.status == 401) {
        console.log('user is notvalid', res);
        let errMsg = res.error.message;
      }
    })
  }
}
