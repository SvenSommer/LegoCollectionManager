import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StatusModel } from '../models/status-model';
import { TypeModel } from '../models/type-model';
import { UserModel } from '../models/user-model';

@Injectable({
    providedIn: 'root'
  })

  export class PreferencesService {
    constructor(private http: HttpClient) {
    }

    getUsers(): Observable<any> {
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

    getUsergroups(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}usergroups`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getUsergroupById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}usergroups/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }
  
    saveUsergroup(model: UserModel): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.post<UserModel>(`${environment.baseUrl}usergroups`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }
  
    updateUsergroup(model: UserModel): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        })
        return this.http.put<UserModel>(`${environment.baseUrl}usergroups/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
    }
  
    deleteUsergroup(id): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.delete<any>(`${environment.baseUrl}usergroups/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }

    getStatus(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}status`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getStatusById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}status/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }
  
    saveStatus(model: StatusModel): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.post<StatusModel>(`${environment.baseUrl}status`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }
  
    updateStatus(model: StatusModel): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        })
        return this.http.put<UserModel>(`${environment.baseUrl}status/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
    }
  
    deleteStatus(id): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.delete<any>(`${environment.baseUrl}status/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }

    getTypes(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}types`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getTypeById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}types/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }
  
    saveType(model: TypeModel): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.post<StatusModel>(`${environment.baseUrl}types`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }
  
    updateType(model: TypeModel): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        })
        return this.http.put<TypeModel>(`${environment.baseUrl}types/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
    }
  
    deleteType(id): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.delete<any>(`${environment.baseUrl}types/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }
}