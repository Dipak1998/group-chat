import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { NotificationsService } from 'angular2-notifications';
import { debounceTime, switchMap } from 'rxjs/operators';
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
  @ViewChild('selectAddMemeber') selectAddMemeber!: MatSelect;
  @ViewChild('selectAddMemeberOnCrtGrp') selectAddMemeberOnCrtGrp!: MatSelect;
  
  groupList:Array<IGroupListApiResponse>|any = []; 
  filteredGroup:Array<IGroupListApiResponse> |any ;
  selectedGroup:IGroupListApiResponse|any = {};
  userList: Array<IUserApiResponse> | any = [];
  filteredUserList: any  = [];
  messageList: Array<IMessageApiReponse> | any = [];
  // filteredMessages: Array<IMessageApiReponse> | any = [];
  messageInput!:string;

  selectedMembers = [];

  searchedMembers:Array<IUserApiResponse> | any = [];

  createGroupForm = this.ss.fb.group({
    group_name:['', Validators.required],
    members: [[], Validators.required],
    user_id: [this.userId, Validators.required]
  })

  membersCtr = new FormControl( [],Validators.required);
  searchUserCtr = new FormControl();
  searchAddUserCtr = new FormControl();
  searchGroupNameCtr = new FormControl();

  get isSelectedGroupEmpty(){
    return Object.keys(this.selectedGroup)?.length === 0;
  }

  get userId(){
    return this.user.getUserId()
  }

  get userEmail(){
    return this.user.getEmail()
  }

  get filteredMessages() : Array<IMessageApiReponse> | any{
    const groupId = this.selectedGroup?.id; 
    return this.messageList.filter((message:IMessageApiReponse)=> message?.group_id == groupId)
  }

  get addMemberList(){
    return this.searchedMembers.filter((user:IUserApiResponse)=> !this.selectedGroup.members?.includes(user?.id) )
  }

  get filterGroupList():Array<IGroupListApiResponse> |any{
    return this.filteredGroup
  }

  constructor(
    private socketService: SocketService,
    private ss:SingletonService,
    private http:HttpClient,
    private user:UserService,
    private dialog:MatDialog,
    private _notifications:NotificationsService
  ) { 
    this.onUserSearch();
  }

  ngOnInit(): void {
    // this.socketService.joinGroup('exampleGroup');
    this.getUserList();
    this.getGroupList();
    this.getMessageList(); 
    this.socketService.messageReceived$.subscribe((message) => {
      console.log('Update messageList:', message);
      this.messageList.push(message); 
    });

    this.socketService.messageLiked$.subscribe((message) => {
      console.log('Update messageList as message liked:', message);
      this.updateMessageBasedOnId(message);
    });
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
      members :formValue?.members, //JSON.stringify(formValue?.members),
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
      this.createGroupForm.reset();
    })
  }
  closePopUp(){
    this.createGroupForm.reset();
    this.searchAddUserCtr.setValue('')
    this.dialog.closeAll();
  }

  getGroupMemebers(group:IGroupListApiResponse){
    return group.members;
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
      }else{
        this.userList = [];
      }
    })
  }

  onGroupClicked(group:IGroupListApiResponse){
    this.selectedGroup = group;
    this.membersCtr.reset();
    this.searchUserCtr.reset();
    this.filteredUserList = [];
  }



  sendMessage(){
    const url = this.ss.baseUrl + "send_message";
    console.log("send message....", this.selectedGroup,"this.messageInput",this.messageInput);
    const payLoad = {
      message: this.messageInput?.trim(),
      group_id: this.selectedGroup?.id,
      user_id: this.userId
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
        // this.filterMessageByGrpId();
      }
    })
  }

  onGroupNameInputChange(input:string|any){
    this.filteredGroup =  this.groupList.filter((group:IGroupListApiResponse) => (group?.group_name?.toLowerCase()?.includes(input?.trim()?.toLowerCase())))

  }
  

  private onUserSearch(){
    this.searchUserCtr.valueChanges.pipe(
        debounceTime(300),
        switchMap((searchText: string) => this.getUserBySearchQuery(searchText))
      ).subscribe((res: any) => {
        if(res.status ==200){
          this.searchedMembers = res?.body?.data;
          if (this.addMemberList.length > 0) {
            this.selectAddMemeber.open();
          } else {
            this.selectAddMemeber.close();
          }
        }else{
          this.searchedMembers = [];
        }
      });
      this.searchAddUserCtr.valueChanges.pipe(
        debounceTime(300),
        switchMap((searchText: string) => this.getUserBySearchQuery(searchText))
      ).subscribe((res: any) => {
        if(res.status ==200){
          this.filteredUserList = res?.body?.data;
          if (this.addMemberList.length > 0) {
            this.selectAddMemeberOnCrtGrp.open();
          } else {
            this.selectAddMemeberOnCrtGrp.close();
          }
        }else{
          this.filteredUserList = [];
        }
      });
  }
    
  onOpenSearchChange(searchInput: any) {
    searchInput.value = "";
    this.searchedMembers = []; //this.userList;
  }

  addMembers(){
    const url = this.ss.baseUrl + "add_members";
    const payload = {
      group_name : this.selectedGroup.group_name,
      members : this.membersCtr.value,
      user_id : this.userId
    }  
    this.http.put(url,payload,{observe:"events"}).subscribe((res:any)=>{
      if(res.status == 200){
        console.log("res", res);
        this._notifications.success('Members Added!', 'Successfully added members', {
          timeOut: 1000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true,
          position:["top" , "right"]
        });
        this.membersCtr.setValue(null);
        this.searchUserCtr.setValue('');
      }
    })
  }

  async getUserBySearchQuery(searchQuery:string){
    const url = this.ss.baseUrl + "users" ;
    let params = new HttpParams();
    params = params.append('search_query',searchQuery)
    return this.http.get(url,{params, observe:"events"}).toPromise()
    
  }

  isUserLikedMessage(message:IMessageApiReponse):boolean{
    const likedUserList = (message?.like_user_id?.length > 0) ? message?.like_user_id : [];
    return likedUserList?.length >0 ? likedUserList?.includes(this.userId) : false; 
  }

  likeMessageClicked(messageId:number){
    const url = this.ss.baseUrl + "like_message";
    const payload = {
      message_id : messageId
    }
    console.log("payload to like message", payload);
    this.http.put(url,payload,{observe:"events"}).subscribe((res:any)=>{
      if(res.status ==200){
        console.log("res", res);
        // this.getMessageList();
        this.updateMessageBasedOnId(res?.body?.data)
      }
    })
  }

  updateMessageBasedOnId(updatedMessage:IMessageApiReponse){
    this.messageList.map((message:IMessageApiReponse)=> {
      if(message.id == updatedMessage.id){
        message.likes = updatedMessage.likes;
        message.like_user_id = updatedMessage.like_user_id;
      }
    });

  }
}
