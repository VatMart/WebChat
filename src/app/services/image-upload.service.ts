import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Room} from "../model/room";
import {Image} from "../model/image";
import {environment} from "../../environments/environment";

const IMAGE_API = environment.apiPath+'/api/image/';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  userImages: Map<number, File> = new Map<number, File>();

  constructor(private http: HttpClient) { }

  uploadImageToUser(file: File): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('file', file);

    return this.http.post(IMAGE_API + 'upload', uploadData);
  }

  getProfileImage(): Observable<Image> {
    return <Observable<Image>>this.http.get(IMAGE_API + 'profileImage');
  }

  getUserImage(userId: number): Observable<Image> | (File | undefined) {
    if (!this.userImages.has(userId))
      return <Observable<Image>>this.http.get(IMAGE_API+'user/'+userId);
    else return this.userImages.get(userId);
  }

  getUsersImagesFromRoom(room: Room) {
    room.users.forEach(user => {
      let getImage = this.getUserImage(user.id);
      if (!this.userImages.has(user.id)) {
        if (getImage instanceof Observable) {
          getImage.subscribe((image) => {
            if (image)
              this.userImages.set(user.id, image.imageBytes);
          })
        }
      }
    })
  }
}
