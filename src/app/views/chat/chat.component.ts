import {Component, Inject, Input, OnInit, Output} from '@angular/core';
import {User} from "../../model/user";
import {Room} from "../../model/room";
import {Message} from "../../model/message";
import {TokenStorageService} from "../../services/token-storage.service";
import {UserService} from "../../services/user.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {RoomService} from "../../services/room.service";
import {DataHandlerService} from "../../services/data-handler.service";
import {FormControl, Validators} from "@angular/forms";
import {EventEmitter} from "events";
import {MessageService} from "../../services/message.service";
import {ImageUploadService} from "../../services/image-upload.service";
import {Observable} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  users: User[] | undefined;
  rooms!: Room[];
  messages: Message[] | undefined;
  selectedRoom!: Room;

  user!: User;
  lastMessagesInRooms: Map<number, Message> = new Map<number, Message>();
  userImages: Map<number, File> = new Map<number, File>();
  isMobile!: boolean;

  constructor(private tokenService: TokenStorageService,
              private userService: UserService,
              public dialogAddRoom: MatDialog,
              protected roomService: RoomService,
              private messageService: MessageService,
              public imageService: ImageUploadService,
              private deviceDetectorService: DeviceDetectorService) {
  }

  //TODO change on real data
  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    console.log(this.isMobile)
    this.lastMessagesInRooms = this.messageService.lastMessagesInRooms;
    this.userImages = this.imageService.userImages;
    this.getCurrentUser();
    this.roomService.roomsSubject.subscribe(rooms => {
      this.rooms = rooms;
      this.messageService.subscribeToRoomsMessages(this.rooms);
      this.messageService.getLastMessagesInRooms(rooms, this.imageService);
    });
    this.roomService.roomSubject.subscribe(room => {
      let checkRoom = this.rooms.find((currentRoom) => (currentRoom.id === room.id));
      if (!checkRoom) {
        this.rooms.push(room);
        this.messageService.subscribeToRoomMessage(room);
        this.messageService.getLastMessageInRoom(room);
      } else {
        checkRoom = room;
        console.log('Изменена комната= '+ checkRoom.name);
      }
    })
      //);
    this.roomService.selectedRoom.subscribe(room => this.selectedRoom = room);
    this.roomService.subscribeToRooms();
    this.requestAllUserRoomList();
  }

  private getCurrentUser() {
    this.userService.getCurrentUser().subscribe(data => {
      this.user = data;
    });
  }

  private requestAllUserRoomList() {
    this.roomService.getRooms();
  }

  openDialog() {
    this.dialogAddRoom.open(DialogAddRoom, {
      data: this.user
    });

  }

  selectRoom(room: Room) {
    if (this.selectedRoom === room) return;
    this.roomService.selectedRoom.next(room);
    console.log("room= "+room.name+" is selected");
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }
}

@Component({
  selector: 'dialog-add-room',
  templateUrl: 'dialog-add-room.html',
  styleUrls: ['./chat.component.css']
})
export class DialogAddRoom {
  constructor(@Inject(MAT_DIALOG_DATA) public user: User,
              protected roomService: RoomService,
              ) {
  }

  nameRoomFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(40),
  ]);

  onCreateRoom() {
    console.log("input room name value="+ this.nameRoomFormControl.value)
    this.roomService.createRoom(this.nameRoomFormControl.value)
  }

}
