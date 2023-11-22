import { AfterViewInit, Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { SingletonService } from './singleton.service';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit,AfterViewInit {
  private socket: Socket;
  socketUrl = environment.socketUrl;
  isSocketConnectionFailed:boolean = false;

  private messageReceivedSubject = new Subject<any>();
  messageReceived$ = this.messageReceivedSubject.asObservable();

  private messageLikedSubject = new Subject<any>();
  messageLiked$ = this.messageLikedSubject.asObservable();

  constructor(
    private ss:SingletonService,
    private user:UserService
  ) {
    this.socket = io(this.socketUrl, {
      transports: ['websocket', 'polling'],
      query: { token: this.user.getToken() }
    });
  }
  ngOnInit(): void {
    this.initializeSocket();
    console.log("Hey i am socket")
  }


  ngAfterViewInit(){
    // this.listen_on_event();
    console.log("Hey i am socket2");
  }

  async initializeSocket() {
    console.log("this.socket.connected",this.socket.connected )
    if(this.socket.connected){
      console.log("connected  ...111");
      this.isSocketConnectionFailed = false; 
      this.messageRecieved();
      this.likedMessage();
    }else{
      console.log("try to reconnect");
      this.isSocketConnectionFailed = true;
      this.socket.on('connect', ()=>{
        //Your Code Here
        console.log("reconnect ...22222");
        this.isSocketConnectionFailed = false;
        this.messageRecieved();
        this.likedMessage();

      });
      this.socket.on('connect_error', (err)=>{
        console.log("connect_error ...",err);
        this.isSocketConnectionFailed = true; 
      });
      this.socket.on('connect_failed', ()=>{
        console.log("connect_failed ...");
        this.isSocketConnectionFailed = true; 
      });
      this.socket.on('disconnect', ()=>{
        console.log("disconnect ...");
        this.isSocketConnectionFailed = true; 
      });
    }
    
   
  }

  joinGroup(email:string,group_id: number): void {
    this.socket.emit('joinGroup', {email, group_id });
  }



  messageRecieved(){
    console.log("message Received called ....")
    this.socket.off('messageReceived').on('messageReceived', (message) => {
      console.log('Received message:', message);
      this.messageReceivedSubject.next(message);
    });
  }

  likedMessage(){
    console.log("message liked  called ....")
    this.socket.off('messageLiked').on('messageLiked', (message) => {
      console.log(' message liked:', message);
      this.messageLikedSubject.next(message);
    });
  }


}
