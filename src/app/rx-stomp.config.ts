import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import * as SockJS from 'sockjs-client';
import {Inject, Injectable, InjectionToken, Injector} from "@angular/core";
import {TokenStorageService} from "./services/token-storage.service";
import {InjectorInstance} from "./app.module";
import {environment} from "../environments/environment";

export class RxStompConfig extends InjectableRxStompConfig {
  constructor(public tokenStorageService: TokenStorageService) {
    super();
    this.webSocketFactory = socketProvider;
    this.connectHeaders = {
      //Authorization: 'Bearer ' + tokenStorageService.getToken()
    }
    this.beforeConnect = (client) => {
      if (tokenStorageService.getToken() === null) client.deactivate().then(() =>{
        console.log("Жду авториации")});
    }
    this.heartbeatIncoming = 0;
    this.connectionTimeout = 12000;
    this.heartbeatOutgoing = 20000;
    this.reconnectDelay = 1000;
    this.debug = (msg: string): void => {
      console.log(new Date(), msg);
    }
  }
}
export function socketProvider() {
  let token = <string>sessionStorage.getItem('webchat-auth-acc-token');
  if (token === null) {
    console.log("Token = null")
    return null;
  } else {
    console.log("Token not null = " + token);
    return new SockJS(environment.apiPath+"/chat?auth=" + token);
  }
}

