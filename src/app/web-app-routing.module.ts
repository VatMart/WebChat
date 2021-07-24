import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {SigninComponent} from "./views/signin/signin.component";
import {SignupComponent} from "./views/signup/signup.component";
import {ChatComponent} from "./views/chat/chat.component";
import {AuthGuardService} from "./services/auth-guard.service";


const routes: Routes = [
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'main', component: ChatComponent, canActivate: [AuthGuardService]},
  {path: '', redirectTo: 'main', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class WebAppRoutingModule {
}
