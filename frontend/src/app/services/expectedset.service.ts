import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RunnedSetModel } from '../models/runnedset-model';

@Injectable({
    providedIn: 'root'
  })
export class ExpectedSetService {
    constructor(private http: HttpClient) {
    }

    getExpectedSets(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}expectedsets`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

     geExpectedSetsBySetno(setno): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}expectedsets/setno/` + setno , { withCredentials: true, headers: httpHeader, observe: 'response' });
    } 

      getExpectedSetId(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}expectedsets/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
      } 

}