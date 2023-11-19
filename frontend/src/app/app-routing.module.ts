import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './layout/login/login.component';
import { DashboardComponent } from './view_modules/dashboard/dashboard.component';
import { ChatHomeComponent } from './view_modules/chat-home/chat-home.component';
import { AuthGuardSecurityService_Admin, AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path:'login' , component:LoginComponent },
  { path:'dashboard' , component:DashboardComponent ,canActivate:[AuthGuardSecurityService_Admin]},
  { path:'chat-home' , component:ChatHomeComponent,canActivate:[AuthGuardService] },
  { path:'' , redirectTo:'login', pathMatch : 'full' },
  { path: '**', redirectTo: 'login'}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
