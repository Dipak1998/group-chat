import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
// import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class SingletonService {


  sidebarItems = [
    { "text": "Dasboard", "link": "dashboard" },
    {
      "text": "Setup", "link": "",
      "submenu": [
        { "text": "Category", "link": "category-list" },
        { "text": "Product", "link": "product-list" },
        { "text": "Service", "link": "service-list" },
        { "text": "User", "link": "user-list" },
        { "text": "Employee", "link": "employee-list" },
      ]
    },
    {
      "text": "Billing", "link": "",
      "submenu": [
        { "text": "Purchase Entry", "link": "purchase-entry" },
        { "text": "Billing", "link": "billing" },
        { "text": "Issue", "link": "issue" },
      ]
    },
    {
      "text": "Report", "link": "",
      "submenu": [
        { "text": "Purchase List", "link": "purchase-list" },
        { "text": "Product Stock", "link": "product-stock" },
        { "text": "Product Out Details", "link": "product-out-stock" },
        { "text": "Billing List ", "link": "billing-list" },
        { "text": "Service List", "link": "employee-service-list" },
        { "text": "Customer List", "link": "customer-list" },
      ]
    }   
  ]

  // the form builder used to build formgroups and formarrays
  fb: FormBuilder = new FormBuilder();

  // subject to unsubscibe subscriptions
  destroy$ = new Subject();

  // subject used to emit the window resize event object whenever window is resized
  windowResize$: Subject<Event> = new Subject();

  theme: "light" | "dark" = "dark";

  // reference to the loader  component in app component used for http request
  // loader: LoaderComponent;

  // progressBar: ProgressBarComponent;

  // ref to the status message component in the app component
  // statusMessage: StatusMessageComponent;


  // constant to hold the latest state emitted of the isPreSignIn$
  isPreSignIn: boolean = true;
  // subject to emit boolean if the application active view is in pre sign in area
  // isPreSignIn$: Subject<boolean> = new Subject();
  isPreSignIn$: BehaviorSubject<boolean> = new BehaviorSubject(this.isPreSignIn);



  // subject to emit boolean if the user is logged in
  loggedIn$: Subject<boolean> = new Subject();

  // constant to hold the latest state emitted of the loggedIn$
  loggedIn: boolean = false;

  // subject to emit boolean sidebar is opened / closed
  sideBarToggle$: Subject<boolean> = new Subject();

  // constant to hold sidebar is opened / closed
  sideBarToggle: boolean = false;

  // baseUrl = "http://10.60.62.54:8000/api/";
  baseUrl = environment.apiUrl + 'api/';
  baseSocketUrl = environment.socketUrl;


  // property to hold refs the different svg sprite urls used to contain the icons. There may be more than one. It is used in svg icon directive
  svg: string[] = [];

  // subject used to communicate with the sidebar component for menu manipulation
  menu$: Subject<{ key: any, value: any }> = new Subject();

  // subject used to communicate with the resolve timeshet for manipulation
  resTimeSheet$: Subject<{ rc: any, pac: any }> = new Subject();

  //attendance flag
  attendanceFlag: boolean = false

  leaveFlag: boolean = false;



  // responsive state to find out the current state of each break points
  responsiveState: any;

  constructor(
    // private dialog: MatDialog
    private datePipe :DatePipe
  ) {
    this.loggedIn$.pipe(takeUntil(this.destroy$)).subscribe(val => {
      this.loggedIn = val;
    })
    this.isPreSignIn$.pipe(takeUntil(this.destroy$)).subscribe(val => {
      this.isPreSignIn = val;
    })
  }



  convertDateFormate(date:string){
    if(date == null || date == '' || date == undefined){
      return ''
    }
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }


}
