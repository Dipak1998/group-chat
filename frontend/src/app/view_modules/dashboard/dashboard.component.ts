import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationsService } from 'angular2-notifications';
import { SingletonService } from 'src/app/services/singleton.service';
import { UserService } from 'src/app/services/user.service';
import { IUserApiResponse } from 'src/app/types/api-interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('createEditUserRef') createEditUserRef!: ElementRef;
  dataSource:any = new MatTableDataSource();
  columnsToDisplay = ['s_no','name','email','mobile_no','role','status','action'];
  isEditForm:boolean = false;

  createUserForm = this.ss.fb.group({
    name:['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    mobile_no:['', Validators.required]
  })

  constructor(
    private ss:SingletonService,
    private user:UserService,
    private http:HttpClient,
    private _notifications:NotificationsService,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList(){
    const url = this.ss.baseUrl+'users';
    this.http.get<any>(url,{observe:'events'}).subscribe((res:any)=>{
      if(res.status == 200){
        const users:IUserApiResponse = res.body.data;
        console.log("users",users);
        this.dataSource.data = users;
        this._notifications.success('Fetch Success!', 'Successfully Fetch Data', {
          timeOut: 1000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true,
          position:["top" , "right"]
        });
      }
    })
  }

  refreshUsers(){
    this.getUserList()
  }
  openAddUserPopup(isEdit:boolean=false){
    this.isEditForm = isEdit;
    this.dialog.open(this.createEditUserRef as any, {
      width: '360px'
    });
  }

  addOrEditUserClicked(){
    const url = this.ss.baseUrl+ (this.isEditForm ? 'user' :"add_user");
    const payload = this.createUserForm.value
    console.log("payload", this.createUserForm);
    this.http.post<any>(url,payload,{observe:'events'}).subscribe((res:any)=>{
      if(res.status == 201){
        this._notifications.success('User Created!', 'Successfully user created', {
          timeOut: 1000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true,
          position:["top" , "right"]
        });
        this.closePopUp();
        this.getUserList();
      }
    })

  }
  closePopUp(){
    this.createUserForm.reset()
    this.dialog.closeAll();
  }

  onDeleteUserClicked(){

  }
}
