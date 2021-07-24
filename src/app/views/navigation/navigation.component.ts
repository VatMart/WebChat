import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  isLoggedIn = false;
  isDataLoaded = false;
  //user: User;

  constructor(private tokenService: TokenStorageService,
              //private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenService.getToken();

    // if(this.isLoggedIn) {
    //   this.userService.getCurrentUser()
    //     .subscribe((data: User) => {
    //       this.user = data;
    //       this.isDataLoaded = true;
    //     })
    // }
  }

  logout(): void {
    this.tokenService.logOut();
    this.router.navigate(['/signin']);
  }
}
