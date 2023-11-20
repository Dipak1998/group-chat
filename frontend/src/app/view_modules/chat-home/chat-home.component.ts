import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import { SingletonService } from 'src/app/services/singleton.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { IGroupListApiResponse, IMessageApiReponse, IUserApiResponse } from 'src/app/types/api-interface';
@Component({
  selector: 'app-chat-home',
  templateUrl: './chat-home.component.html',
  styleUrls: ['./chat-home.component.scss']
})
export class ChatHomeComponent implements OnInit {


  @ViewChild('createGroupRef') createGroupRef!: ElementRef;
  groupList:Array<IGroupListApiResponse>|any = []; 
  filteredGroup:Array<IGroupListApiResponse> |any ;
  selectedGroup:IGroupListApiResponse|any = {};
  userList: Array<IUserApiResponse> | any = [];
  filteredUserList: any ;
  messageList: Array<IMessageApiReponse> | any = [];
  filteredMessages: Array<IMessageApiReponse> | any = [];
  messageInput!:string;
  searchGroupName:string="";
  selectedMembers = []

  createGroupForm = this.ss.fb.group({
    group_name:['', Validators.required],
    members: [null, Validators.required],
    user_id: [this.userId, Validators.required]
  })
  get isSelectedGroupEmpty(){
    return Object.keys(this.selectedGroup)?.length === 0;
  }

  get userId(){
    return this.user.getUserId()
  }

  get userEmail(){
    return this.user.getEmail()
  }

  constructor(
    private socketService: SocketService,
    private ss:SingletonService,
    private http:HttpClient,
    private user:UserService,
    private dialog:MatDialog,
    private _notifications:NotificationsService
  ) { }

  ngOnInit(): void {
    // this.socketService.joinGroup('exampleGroup');
    this.getUserList();
    this.getGroupList();
    this.getMessageList();
  }

  openCreateGroupPopup(){
    this.dialog.open(this.createGroupRef as any, {
      width: '440px'
    });
  }

  createGroupClicked(){
    const formValue  = this.createGroupForm.value;
    console.log("createGroupClicked", this.createGroupForm,formValue);
    const url =this.ss.baseUrl +"create_group";
    const payload = {
      group_name :formValue?.group_name,
      members :JSON.stringify(formValue?.members),
      user_id :formValue?.user_id,
    }
    console.log("payload", payload);
    this.http.post(url,payload,{observe:"events"}).subscribe((res:any)=>{
      if(res.status == 201){
        console.log("res", res);
        this._notifications.success('Group Created!', 'Successfully group created', {
          timeOut: 1000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true,
          position:["top" , "right"]
        });
        this.getGroupList();
        this.closePopUp();
      }
    })
  }
  closePopUp(){
    this.dialog.closeAll();
  }

  getGroupMemebers(group:IGroupListApiResponse){
    console.log("77777777777777777", group, typeof(group))
    return JSON.parse(group.members);
  }

  getGroupList(){
    const url = this.ss.baseUrl+'groups';
    this.http.get(url,{observe:"events"}).subscribe((res:any)=>{
      if(res.status == 200){
        this.groupList = res.body.data;
        this.filteredGroup = this.groupList;
        this.filteredGroup.forEach((group:IGroupListApiResponse)=>{
          /** joinig the group and listening the message */
          this.socketService.joinGroup(this.userEmail,group.id)
        })
        this.socketService.messageRecieved();
      }else{
        this.groupList = [];
        this.filteredGroup = [];
      }
    })
  }

  getMessageList(){
    const url = this.ss.baseUrl + 'messages';
    this.http.get(url, {observe:"events"}).subscribe((res:any)=>{
      if(res.status == 200){
        console.log("messages", res.body);
        this.messageList = res?.body?.data;
      }
    })  
  }

  getUserList(){
    const url = this.ss.baseUrl+"users"
    this.http.get(url,{observe:"events"}).subscribe((res:any)=>{
      console.log("res", res);
      if(res.status == 200){
        this.userList = res?.body?.data;
        this.filteredUserList = this.userList;
      }else{
        this.userList = [];
        this.filteredUserList = [];
      }
    })
  }

  onGroupClicked(group:IGroupListApiResponse){
    this.selectedGroup = group;
    this.filterMessageByGrpId();
  }

  filterMessageByGrpId(){
    const groupId = this.selectedGroup?.id; 
    this.filteredMessages = this.messageList.filter((message:IMessageApiReponse)=> message?.group_id == groupId)
  }

  sendMessage(){
    const url = this.ss.baseUrl + "send_message";
    console.log("send message....", this.selectedGroup,"this.messageInput",this.messageInput);
    const payLoad = {
      message: this.messageInput,
      group_id: this.selectedGroup?.id,
      user_id: this.selectedGroup?.user_id
    }
    this.http.post(url,payLoad,{observe:"events"}).subscribe((res:any)=>{
      if(res.status == 201){
        console.log("res", res);
        this._notifications.success('Message Send!', 'Successfully send message', {
          timeOut: 1000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true,
          position:["top" , "right"]
        });
        this.messageInput = "";
        this.getMessageList();
        this.filterMessageByGrpId();
      }
    })
  }

  onGroupNameInputChange(input:string){
    this.filteredGroup = this.groupList.filter((group:IGroupListApiResponse) => group?.group_name == input)
  }
  
  onInputChange(event: any) {
    console.log("called....", event)
    const searchInput = event.target.value.toLowerCase();

    this.filteredUserList = this.userList.filter((user:IUserApiResponse) => {
      const email = user?.email.toLowerCase();
      const name = user?.name.toLowerCase();
      return email?.includes(searchInput);
    });
    console.log("this.filteredUserList", this.filteredUserList)
  }

  onOpenChange(searchInput: any) {
    searchInput.value = "";
    this.filteredUserList = this.userList;
  }

}
