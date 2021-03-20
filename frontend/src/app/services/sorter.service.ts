import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SorterModel } from '../models/sorter-model';

@Injectable({
    providedIn: 'root'
  })
export class SorterService {
    constructor(private http: HttpClient) {
    }

    getSorters(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}sorters`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getSortersById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}sorters/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    saveSorter(model: SorterModel): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.post<SorterModel>(`${environment.baseUrl}sorters`, model, { withCredentials: true, headers: headers, observe: 'response' });
      }

    updateCollection(model: SorterModel): Observable<any> {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
    })
    return this.http.put<SorterModel>(`${environment.baseUrl}sorters/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
    }
}