import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RunModel } from '../models/run-model';

@Injectable({
    providedIn: 'root'
  })
export class RecognisedpartsService {
    constructor(private http: HttpClient) {
    }
      
    getRecognisedpartByRunid(id): Observable<any> {

        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}recognisedparts/run/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getRecognisedpartById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}recognisedparts/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    saveRecognisedpart(model: RunModel): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.post<RunModel>(`${environment.baseUrl}recognisedparts`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }
  
    updatetRecognisedpart(model: RunModel): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        })
        return this.http.put<RunModel>(`${environment.baseUrl}recognisedparts/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
    }
  
    deleteRecognisedpart(id): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.delete<any>(`${environment.baseUrl}recognisedparts/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }

    markRecognisedpartAsDeletedById(id): Observable<any> {
        console.log("DELETE Recognisedpartid = " + id)
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.delete<any>(`${environment.baseUrl}recognisedparts/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }
}