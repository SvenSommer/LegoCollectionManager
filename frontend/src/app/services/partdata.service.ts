import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {  PartnameFrequencyModelExport } from '../models/partnamefrequency-model';

@Injectable({
    providedIn: 'root'
  })
export class PartdataService {
    constructor(private http: HttpClient) {
    }

    savePartnameFrequency(model: PartnameFrequencyModelExport): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.post<PartnameFrequencyModelExport>(`${environment.baseUrl}partdata/partnamefrequency`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

    getPartdata(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}partdata`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    // getStoredPartnameFrequency(): Observable<any> {
    //     let httpHeader = new HttpHeaders();
    //     httpHeader.set("Access-Control-Allow-Origin", "*");
    //     return this.http.get<any>(`${environment.baseUrl}partdata/partnamefrequency`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    // }

    getPartdataAggegratedByPartnumber(reqSearchwords): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}partdata/aggregatedbypartno/` + reqSearchwords, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }
}