import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../model/user";
import {NotificationService} from "../../services/notification.service";
import {ImageUploadService} from "../../services/image-upload.service";
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  user!: User;
  isUserDataLoaded = false;
  selectedFile!: File;
  userProfileImage!: File;
  previewImgURL: any;

  constructor(private userService: UserService,
              private notificationService: NotificationService,
              private imageService: ImageUploadService,
              private tokenService: TokenStorageService
              ) {
  }

  ngOnInit(): void {
    this.userService.getCurrentUser()
      .subscribe(data => {
        this.user = data;
        this.isUserDataLoaded = true;
      });
    this.imageService.getProfileImage()
      .subscribe(data => {
        if (data)
          this.userProfileImage = data.imageBytes;
      });
  }

  onFileSelected(event:any): void {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.previewImgURL = reader.result;
    };
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  onUpload(): void {
    if (this.selectedFile != null) {
      this.imageService.uploadImageToUser(this.selectedFile)
        .subscribe(() => {
          this.notificationService.showSnackBar('Profile Image updated successfully');
        });
    }
  }
}
