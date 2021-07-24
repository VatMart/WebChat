import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {NotificationService} from "../../services/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  // @ts-ignore
  public registerForm: FormGroup;

  constructor(private authService: AuthService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
    this.registerForm = this.createRegisterForm();
  }

  createRegisterForm(): FormGroup {
    return this.fb.group({
      login: ['', Validators.compose([Validators.required])],
      nickname: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  submit(): void {
    console.log(this.registerForm.value);

    this.authService.register({
      login: this.registerForm.value.login,
      nickname: this.registerForm.value.nickname,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword,
    }).subscribe((data: any) => {
      console.log(data);
      this.notificationService.showSnackBar('Successfully Registered!');
      this.router.navigate(['/signin']);
    }, (error: any) => {
      this.notificationService.showSnackBar('Something went wrong during registration');
    });
  }

}
