import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PartnameFrequencyModel } from '../models/partnamefrequency-model';

@Injectable({
    providedIn: 'root'
  })
export class PartdataService {
    constructor(private http: HttpClient) {
    }

    savePartnameFrequency(model: PartnameFrequencyModel): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.post<PartnameFrequencyModel>(`${environment.baseUrl}partdata/partnamefrequency`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

    getPartdata(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}partdata`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }
}