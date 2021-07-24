import {AfterViewChecked, Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {DataHandlerService} from "../../services/data-handler.service";
import {User} from "../../model/user";
import {Room} from "../../model/room";
import {Message} from "../../model/message";
import {RoomService} from "../../services/room.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "../../services/message.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {NotificationService} from "../../services/notification.service";
import {ImageUploadService} from "../../services/image-upload.service";
import {filter, map} from "rxjs/operators";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, AfterViewChecked {

  users!: User[];
  activeRoom!: Room;
  messages!: Message[];
  currentUserId!: number;
  selfMessage: String = "ks-self";
  fromMessage: String = "ks-from";
  userImages: Map<number, File> = new Map<number, File>();

  newMessageText!: String;
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  disableScrollDown = false;


  constructor(private dataHandlerService: DataHandlerService,
              private roomService: RoomService,
              public messageService: MessageService,
              public dialog: MatDialog,
              private tokenStorageService: TokenStorageService,
              private notificationService: NotificationService,
              public imageService: ImageUploadService) {
  }

  ngOnInit(): void {
    this.userImages = this.imageService.userImages;
    this.currentUserId = this.tokenStorageService.getUser().user_id;
    console.log("TEMP userId="+this.currentUserId);
    //this.users = this.dataHandlerService.getUserList();
    //this.messages = this.dataHandlerService.getMessages();
    this.roomService.selectedRoom.subscribe(room => {
      this.activeRoom = room;
      this.users = room.users;
      this.messageService.getAllMessages(this.activeRoom.id);
      this.imageService.getUsersImagesFromRoom(room);
    });
    this.messageService.subjectMessages.subscribe((messages) => {
      this.messages = messages;
      this.disableScrollDown = false
      this.scrollToBottom();
    })
    this.messageService.subjectMessage.subscribe((message) => {
      this.messageService.lastMessagesInRooms.set(message.room_id, message);
      if (this.activeRoom && this.activeRoom.id === message.room_id) {
        this.messages.push(message);
        this.disableScrollDown = false;
        this.scrollToBottom();
        console.log("Новое сообщение из текущей комнаты " + message.room_id);
      } else {
        console.log("Новое сообщение из комнаты " + message.room_id);
        this.notificationService.showSnackBar("Новое сообщение из комнаты " + message.room_id);
      }
    })
    this.scrollToBottom();
  }
  //*ngIf="getSenderImage(message.sender_id) | async; let image"

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  onReceivedImage(data : any) : any {
    return data.imageBytes;
  }

  getSenderImage(senderId: number): Observable<String> {
    let getImage = this.imageService.getUserImage(senderId);
    if (getImage instanceof Observable)
     return getImage.pipe(
        map(val => ('data:image/jpeg;base64,' +val.imageBytes)));
    else return of('data:image/jpeg;base64,' +getImage);
  }



  onScroll() {
    let element = this.myScrollContainer.nativeElement
    let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
    this.disableScrollDown = !(this.disableScrollDown && atBottom);
  }

  scrollToBottom(): void {
    if (this.disableScrollDown) {
      return;
    }
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  openDialogMembers() {
    const dialogRef = this.dialog.open(DialogMembers, {
      //width: '250px',
     // height: '50%',
      data: {room: this.activeRoom, users: this.users}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  sendMessage() {
    if (this.newMessageText && this.newMessageText.length>0) {
        this.messageService.createMessage(this.activeRoom.id, this.newMessageText);
        this.newMessageText = '';
    } else {
      console.log("Сообщение пустое!");
    }
  }
}
export interface MemberDialogData {
  room: Room;
  users: User[];
}
@Component({
  selector: 'dialog-members',
  templateUrl: 'dialog-members.html',
  styleUrls: ['./message-list.component.css']
})
export class DialogMembers {
  nickname!:string;

  constructor(
    public dialogRef: MatDialogRef<DialogMembers>,
    @Inject(MAT_DIALOG_DATA) public data: MemberDialogData,
    private roomService: RoomService) {}

  addUser() {
    this.roomService.addUserToRoom(this.nickname, this.data.room.id);
  }
}
