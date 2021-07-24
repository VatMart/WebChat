import {Injector, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {WebAppRoutingModule} from "./web-app-routing.module";
import {authInterceptorProviders} from './services/auth-interceptor.service';
import {HttpClientModule} from "@angular/common/http";
import {authErrorInterceptorProviders} from "./services/error-interceptor.service";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "./material.module";
import {DialogMembers, MessageListComponent} from "./views/message-list/message-list.component";
import {ChatComponent, DialogAddRoom} from "./views/chat/chat.component";
import {SigninComponent} from "./views/signin/signin.component";
import {SignupComponent} from "./views/signup/signup.component";
import {NavigationComponent} from "./views/navigation/navigation.component";
import {UserInfoComponent} from "./views/user-info/user-info.component";
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory} from "@stomp/ng2-stompjs";
import {RxStompConfig} from "./rx-stomp.config";
import {TokenStorageService} from "./services/token-storage.service";
import '@angular/common/locales/global/ru';

@NgModule({
  declarations: [
    AppComponent,
    MessageListComponent,
    NavigationComponent,
    UserInfoComponent,
    ChatComponent,
    SigninComponent,
    DialogAddRoom,
    DialogMembers,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    WebAppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [authInterceptorProviders,
    authErrorInterceptorProviders,
    {
      provide:InjectableRxStompConfig,
      useClass: RxStompConfig,
      deps: [TokenStorageService]
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    },
    {
      provide: LOCALE_ID, useValue: 'ru'
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    InjectorInstance = this.injector;
  }
}
export let InjectorInstance: Injector;
