import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SortedPartModel } from '../models/sortedpart-model';


@Injectable({
    providedIn: 'root'
  })
export class SortedPartService {

    constructor(private http: HttpClient) {
    }

    
    createSortedPart(model: SortedPartModel): Observable<any> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      return this.http.post<SortedPartModel>(`${environment.baseUrl}sortedparts`, model, { withCredentials: true, headers: headers, observe: 'response' });
  }

    DeleteSortedPart(expectedpart_id): Observable<any> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      return this.http.delete<any>(`${environment.baseUrl}sortedparts/expectedpartid/` + expectedpart_id , { withCredentials: true, headers: headers, observe: 'response' });
    }
 
    getSortedPartsBySetId(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}sortedparts/expectedsetid/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
      }

}