import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';
import { Authenticate, Login, Signup } from './types';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  signUp(data: Signup):Observable<any> {
    return this.http.post(environment.BASE_URL + 'signup', data);
  }

  login(data: Login):Observable<any> {
    return this.http.post(environment.BASE_URL + 'login', data);
  }

  authenticate(data: Authenticate):Observable<any> {
    return this.http.post(environment.BASE_URL + 'auth', data);
  }

  generateNewOTP(username: { username: string }):Observable<any> {
    return this.http.put(environment.BASE_URL + 'reAuth', username);
  }

}
