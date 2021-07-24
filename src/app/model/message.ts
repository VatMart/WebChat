import {User} from "./user";

export interface Message {
  id: number;
  text: string;
  sendingDate: Date;
  sender_id: number;
  room_id: number;
  unread?: boolean;
}
