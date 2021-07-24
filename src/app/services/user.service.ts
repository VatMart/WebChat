import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

const USER_API = environment.apiPath+'/api/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserById(id: number): Observable<any> {
    return this.http.get(USER_API + id);
  }

  getCurrentUser(): Observable<any> {
    let user = this.http.get(USER_API);
    return user;
  }

  //TODO UPDATE USER
}
