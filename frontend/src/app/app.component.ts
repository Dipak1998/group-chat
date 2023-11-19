import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { SingletonService } from './services/singleton.service';
import { UserService } from './services/user.service';
import { SocketService } from './services/socket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'meet@';

  isPreSignIn: boolean = true;
  destroy$ = new Subject();
  public notificationOptions = {
    position: ["bottom", "left"]
}

  constructor(
    private user: UserService,
    private ss: SingletonService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private socketService: SocketService
  ) {

  }

  ngOnInIt() {
    console.log("app called ...");
    this.redirectBaseSession();
    this.ss.isPreSignIn$.pipe(takeUntil(this.destroy$), debounceTime(500)).subscribe(val => {
      console.log('value', val)
      this.isPreSignIn = val;
      this.cdRef.detectChanges();
    })

  }
  ngAfterViewInit() {
    console.log("app called ...");
    this.initSharedViewComponents();
    this.redirectBaseSession();
    this.ss.isPreSignIn$.pipe(takeUntil(this.destroy$), debounceTime(500)).subscribe(val => {
      console.log('value', val)
      this.isPreSignIn = val;
      this.cdRef.detectChanges();
      console.log("isPreSignIn:", this.isPreSignIn)
    })
  }
  redirectBaseSession() {
    console.log("redirect nase session")
    if (!this.user.validateSession()) {
      console.log("if", this.user.validateSession())
      this.router.navigate(['/login'])
    } else {
      console.log("else", this.user.validateSession())
      // this.router.navigate(['/dashboard'])
      setTimeout(()=>{
        this.initSocketSocketConnection();
      },3000)
    }
  }
  // in the afterviewinit lifecycle hook, the viewchildren are initialized and can be used across the app via singleton service.
  initSharedViewComponents() {}

  initSocketSocketConnection(){
    this.socketService.initializeSocket();
  }

}
