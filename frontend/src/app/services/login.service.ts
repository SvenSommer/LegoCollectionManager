import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(username, password) : Observable<any> {
   return this.http.post(`${environment.baseUrl}users/login`, { username: username, password: password }, {withCredentials:true,observe: 'response'});
  }
}
