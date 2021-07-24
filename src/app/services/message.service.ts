import { Injectable } from '@angular/core';
import {WebSocketService} from "./web-socket.service";
import {RxStompService} from "@stomp/ng2-stompjs";
import {Observable, Subject} from "rxjs";
import {Room} from "../model/room";
import {Message} from "../model/message";
import {IMessage} from "@stomp/stompjs";
import {User} from "../model/user";
import {HttpClient} from "@angular/common/http";
import {ImageUploadService} from "./image-upload.service";
import {environment} from "../../environments/environment";

const MESSAGE_API = environment.apiPath+'/api/message/';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  subjectMessages = new Subject<Message[]>();
  subjectMessage = new Subject<Message>();
  lastMessagesInRooms: Map<number, Message> = new Map<number, Message>();

  constructor(private rxStompService: RxStompService, private http: HttpClient) { }

  getAllMessages(roomId : number) {
    this.rxStompService.publish({ destination: "/app/room/"+roomId+"/get-all-messages" });
  }

  subscribeToRoomMessage(room: Room) {
    this.rxStompService.watch('/user/queue/'+room.id+'/all-messages').
    subscribe((message)=>this.onReceivedMessages(message,room));
    this.rxStompService.watch('/user/queue/'+room.id+'/message').
    subscribe((message)=>this.onReceivedMessage(message,room));
  }

  private onReceivedMessages = (stompMessage:  IMessage, room: Room) => {
    const messages : Message[] = <Message[]>JSON.parse(stompMessage.body);
    //console.log(messages[0].sendingDate);
    //if (messages.length != 0) {
    this.subjectMessages.next(messages);
      //console.log("Сообщения получены. Number=" + messages.length+" "+stompMessage.body);
    // } else {
    //   console.log("В комнате "+room.name+" нет сообщений");
    // }
  }

  private onReceivedMessage = (stompMessage: IMessage, room: Room) => {
    const message : Message = <Message>JSON.parse(stompMessage.body);
    this.subjectMessage.next(message);
    console.log("Получено новое сообщение в комнате "+room.name+" от пользователя "+message.sender_id)
  }

  subscribeToRoomsMessages(rooms: Room[]) {
    rooms.forEach((room) => {
      this.rxStompService.watch('/user/queue/'+room.id+'/all-messages').
      subscribe((message)=>this.onReceivedMessages(message,room))
      this.rxStompService.watch('/user/queue/'+room.id+'/message').
      subscribe((message)=>this.onReceivedMessage(message,room));
    })
  }

  getUserFromUserIdInRoom(room:Room, userId: number) : User {
    return <User>room.users.find((user) => user.id === userId);
  }

  createMessage(roomId:number, textMessage:String) {
    let requestBody = {text: textMessage};
    this.rxStompService.publish({destination: "/app/room/"+roomId+"/add-message", body: JSON.stringify(requestBody)});
  }

  getLastMessagesInRooms(rooms: Room[], imageService: ImageUploadService) {
    rooms.forEach((room) => {
      this.http.get(MESSAGE_API+"room/"+room.id+"/last-message").subscribe((data) => {
        let message = <Message>data;
        this.lastMessagesInRooms.set(room.id, message);
        if (message) {
          let getImage = imageService.getUserImage(message.sender_id);
          if (getImage instanceof Observable) {
            getImage.subscribe((img) => imageService.userImages.set(message.sender_id, img.imageBytes))
          }
        }
      })
    })
  }

  getLastMessageInRoom(room: Room) {
    this.http.get(MESSAGE_API+"room/"+room.id+"/last-message").subscribe((message) => {
      this.lastMessagesInRooms.set(room.id, <Message>message);
    })
  }
}
