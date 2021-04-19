import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RunModel } from '../models/run-model';

@Injectable({
    providedIn: 'root'
  })
export class IdentifiedpartService {
    constructor(private http: HttpClient) {
    }
      
    getIdentifiedpartByRunid(id): Observable<any> {

        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}identifiedparts/run/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getIdentifiedpartById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}identifiedparts/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    saveIdentifiedpart(model: RunModel): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.post<RunModel>(`${environment.baseUrl}identifiedparts`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }
  
    updatetIdentifiedpart(model: RunModel): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        })
        return this.http.put<RunModel>(`${environment.baseUrl}identifiedparts/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
    }
  
    deleteIdentifiedpart(id): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.delete<any>(`${environment.baseUrl}identifiedparts/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }

    markIdentifiedpartAsDeletedById(id): Observable<any> {
        console.log("DELETE identifiedpartid = " + id)
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.delete<any>(`${environment.baseUrl}identifiedparts/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }

    getPartdata(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}partdata`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }
    
    getColordata(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}colors`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }
}