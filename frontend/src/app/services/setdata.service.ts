import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class SetdataService {
    constructor(private http: HttpClient) {
    }

    getSetdata(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}setdata`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getSetdataById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}setdata/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
      }

    getSubsetPartdataBySetid(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}subsetdata/setid/` + id + '/parts', { withCredentials: true, headers: httpHeader, observe: 'response' });
      }

    getSubsetMinifigdataBySetid(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}subsetdata/setid/` + id + '/minifigs', { withCredentials: true, headers: httpHeader, observe: 'response' });
      }

    getExpectedPartdataBySetid(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}expectedparts/expectedsetid/` + id + '/parts', { withCredentials: true, headers: httpHeader, observe: 'response' });
      }

    getExpectedMinifigdataBySetid(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}expectedparts/expectedsetid/` + id + '/minifigs', { withCredentials: true, headers: httpHeader, observe: 'response' });
      }
}