import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

const AUTH_API = environment.apiPath+'/api/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  public login(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      login: user.login,
      password: user.password
    });
  }

  public register(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      login: user.login,
      nickname: user.nickname,
      password: user.password,
      confirmPassword: user.confirmPassword
    });
  }
}
