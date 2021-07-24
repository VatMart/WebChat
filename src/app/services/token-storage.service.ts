import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

const TOKEN_KEY = 'webchat-auth-acc-token';
const USER_KEY = 'webchat-auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return <string>sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(<string>sessionStorage.getItem(USER_KEY));
  }

  logOut(): void {
    window.sessionStorage.clear();
    //window.location.reload();
  }
}
