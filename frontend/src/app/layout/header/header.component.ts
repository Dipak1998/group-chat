import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  get userName():string{
    return this.user.getName();
  }

  get isAdmin():boolean{
    return this.user.getIsAdmin()
  }
  constructor(
    private user:UserService
  ) { }

  ngOnInit(): void {
  }

  onLogoutClicked(){
    console.log("logout clicked ...")
    this.user.logout();
  }

}
