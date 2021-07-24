import { Injectable } from '@angular/core';
import {WebSocketService} from "./web-socket.service";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import * as Stomp from "stompjs";
import {RxStompService} from "@stomp/ng2-stompjs";
import {Room} from "../model/room";
import {User} from "../model/user";
import {Message} from "../model/message";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  roomsSubject = new Subject<Room[]>();
  roomSubject = new Subject<Room>();
  selectedRoom = new Subject<Room>();

  constructor(private webSocketService: WebSocketService,
              private rxStompService: RxStompService) { }

  getRooms() {
    this.rxStompService.publish({ destination: "/app/rooms" });
  }

  subscribeToRooms() {
    const subscribeOnRoom = (room: Room) => {
      this.rxStompService.watch('/room/'+room.id+'/users').
      subscribe((message) =>{
        const user:User = <User>JSON.parse(message.body);
        room.users.push(user);
        this.roomSubject.next(room);
      })
    }
    this.rxStompService.watch('/user/queue/rooms').subscribe(
      (message)  => {
        const rooms : Room[] = <Room[]>JSON.parse(message.body);
        rooms.forEach((room) => subscribeOnRoom(room))
        this.roomsSubject.next(rooms);
        console.log("Комнаты получены. Number=" + rooms.length);
    })
    this.rxStompService.watch('/user/queue/room').subscribe(
      (message) => {
        const room : Room = <Room>JSON.parse(message.body);
        subscribeOnRoom(room);
        this.roomSubject.next(room);
        console.log("Комната получена. name=" + room.name);
    })
  }

  createRoom(roomName: String) {
    let room = {name: roomName};
    // this.webSocketService.wsConnection().subscribe(stompClient => {
    //   stompClient.send("/app/room/add-room", {}, JSON.stringify(room))
    // });
    this.rxStompService.publish({destination: "/app/room/add-room", body: JSON.stringify(room)});
  }

  addUserToRoom(nickname: String, roomId: number) {
    this.rxStompService.publish({destination:"/app/room/"+roomId+"/add-user/"+nickname});
  }
}
