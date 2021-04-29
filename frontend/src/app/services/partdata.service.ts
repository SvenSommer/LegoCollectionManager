import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PartnameFrequencyCachingModel } from '../models/partnamefrequency-model';

@Injectable({
    providedIn: 'root'
  })
export class PartdataService {
    constructor(private http: HttpClient) {
    }


    getPartdata(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}partdata`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getPartdataAggegratedByPartnumber(reqSearchwords): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}partdata/aggregatedbypartno/` + reqSearchwords, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    createCacheEntry(model: PartnameFrequencyCachingModel): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.post<PartnameFrequencyCachingModel>(`${environment.baseUrl}partdata/partnamefrequencycache`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

    searchCacheEntry(searchwords:string): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}partdata/partnamefrequencycache/` + searchwords, { withCredentials: true, headers: httpHeader, observe: 'response' });
    } 
}