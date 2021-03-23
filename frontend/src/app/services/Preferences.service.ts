import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/user-model';

@Injectable({
    providedIn: 'root'
  })

  export class PreferencesService {
    constructor(private http: HttpClient) {
    }

    getUser(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}users`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getUserById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}users/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }
  
    saveUser(model: UserModel): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.post<UserModel>(`${environment.baseUrl}users`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }
  
    updateUser(model: UserModel): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        })
        return this.http.put<UserModel>(`${environment.baseUrl}users/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
    }
  
    deleteUser(id): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.delete<any>(`${environment.baseUrl}users/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }
}