import { Image} from "./image"

export interface User {
  id: number;
  nickname: string;
  registrationDate: Date;
  status?: string;
  avatar?: Image;
  rooms_id?: number[];
}
