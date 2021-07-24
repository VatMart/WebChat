import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NotificationService} from "../../services/notification.service";
import {AuthService} from "../../services/auth.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {Observable} from "rxjs";
import {WebSocketService} from "../../services/web-socket.service";
import {RxStompService} from "@stomp/ng2-stompjs";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  // @ts-ignore
  public loginForm: FormGroup;

  constructor(private authService: AuthService,
              private webSocketService: WebSocketService,
              private tokenStorage: TokenStorageService,
              private notificationService: NotificationService,
              private router: Router,
              private fb: FormBuilder,
              private rxStompService: RxStompService) {
    if (this.tokenStorage.getUser()) {
      this.router.navigate(['main']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.createLoginForm();
  }

  createLoginForm(): FormGroup {
    return this.fb.group({
      login: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  submit(): void {
    this.authService.login({
      login: this.loginForm.value.login,
      password: this.loginForm.value.password
    }).subscribe(data => {
      console.log(data);

      this.tokenStorage.saveToken(data.accToken);
      this.tokenStorage.saveUser(data);

      this.notificationService.showSnackBar('Successfully logged in');
      this.router.navigate(['/']);
      //window.location.reload();
      this.rxStompService.activate();
      //this.webSocketService.connect(this.tokenStorage.getToken());

    }, error => {
      console.log(error);
      this.notificationService.showSnackBar(error.message);
    });
  }
}
