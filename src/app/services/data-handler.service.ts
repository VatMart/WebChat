import {Injectable} from '@angular/core';
import {User} from "../model/user";
import {Room} from "../model/room";
import {Message} from "../model/message";

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  constructor() {
  }

  getUserList(): User[] {
    //TODO
    let users: User[] = [
      {
        id: 1,
        nickname: 'nick1',
        status: 'online',
        registrationDate: new Date()
      },
      {
        id: 2,
        nickname: 'nick2',
        status: 'online',
        registrationDate: new Date()
      },
      {
        id: 3,
        nickname: 'nick3',
        status: 'offline',
        registrationDate: new Date()
      }
    ];
    return users;
  }

  getRoomsList(): Room[] {
    //TODO
    let rooms: Room[] = [
      {id: 1, creator_id: 1, users: [this.getUserList()[0], this.getUserList()[1]], name: 'Room1'},
      {id: 2, creator_id: 2, users: [this.getUserList()[0], this.getUserList()[1], this.getUserList()[2]], name: 'Room2'}
    ]
    return rooms;
  }

  getMessages(): Message[] {
    //TODO
    let messages: Message[] = [
      {
        id: 1,
        room_id: 1,
        sender_id: 2,
        text: 'Тестовое сообщение от Nick2 для Room1',
        sendingDate: new Date()
      },
      {
        id: 2,
        room_id: 1,
        sender_id: 1,
        text: 'Тестовое сообщение от Nick1 для Room1',
        sendingDate: new Date()
      },
      {
        id: 3,
        room_id: 2,
        sender_id: 1,
        text: 'Тестовое сообщение от Nick1 для Room2',
        sendingDate: new Date()
      },
      {
        id: 4,
        room_id: 2,
        sender_id: 3,
        text: 'Тестовое сообщение от Nick3 для Room2',
        sendingDate: new Date()
      },
      {
        id: 5,
        room_id: 2,
        sender_id: 2,
        text: 'Тестовое сообщение от Nick2 для Room2',
        sendingDate: new Date()
      }
    ]
    return messages;
  }
}
