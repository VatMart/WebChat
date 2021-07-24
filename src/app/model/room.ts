import {Message} from "./message";
import {User} from "./user";

export interface Room {
  id: number;
  name: string;
  creator_id: number;
  users: User[];
  messages?: Message[];

}
