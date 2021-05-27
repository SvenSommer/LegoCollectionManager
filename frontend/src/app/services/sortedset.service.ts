import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SortedSetModel } from '../models/sortedset-model';

@Injectable({
    providedIn: 'root'
  })
export class SortedSetService {
    constructor(private http: HttpClient) {
    }

    
    createSortedSet(model: SortedSetModel): Observable<any> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      return this.http.post<SortedSetModel>(`${environment.baseUrl}sortedsets`, model, { withCredentials: true, headers: headers, observe: 'response' });
  }

    getSetSortedSets(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}sortedsets`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getSortedSetdataById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}sortedsets/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
      }

}