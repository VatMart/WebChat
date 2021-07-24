import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {filter, first} from "rxjs/operators";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client'
import {environment} from "../../environments/environment";
import {TokenStorageService} from "./token-storage.service";
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient!: Stomp.Client;
  private state!: BehaviorSubject<SocketClientState>;
  constructor() { }

  connect(token: String) {
    let socket = new SockJS(environment.apiPath+"/chat?auth="+token);
    this.stompClient = Stomp.over(socket);
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.stompClient.connect({}, (event) => {
      this.state.next(SocketClientState.CONNECTED);
      console.log("WEBSOCKET CONNECTED")
    }, (error) => {

      console.log("Error on connection ws")
    });
    socket.onclose = function () {
      console.log("Connection ws closed")
    };

  }

  wsConnection(): Observable<Stomp.Client> {
    return new Observable<Stomp.Client>(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).
      subscribe(() => {
        observer.next(this.stompClient);
      });
    });
  }
}

export enum SocketClientState {
  ATTEMPTING, CONNECTED
}
