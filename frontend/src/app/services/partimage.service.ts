import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RunModel } from '../models/run-model';

@Injectable({
    providedIn: 'root'
  })
export class PartimageService {
    constructor(private http: HttpClient) {
    }

    markPartimageAsDeletedById(id): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        console.log("DELETE " + id)
        return this.http.delete<any>(`${environment.baseUrl}partimages/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }    
    markPartimageAsNotDeletedById(id): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        console.log("REVIVE " + id)
        return this.http.delete<any>(`${environment.baseUrl}partimages/` + id + '/undelete', { withCredentials: true, headers: headers, observe: 'response' });
    }
}