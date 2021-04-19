import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RunModel } from '../models/run-model';

@Injectable({
    providedIn: 'root'
  })
export class RunService {
    private data;

    constructor(private http: HttpClient) {
    }

    setData(data){
      this.data = data;
    }

    getData(){
      let temp = this.data;
      this.clearData();
      return temp;
    }

    clearData(){
      this.data = undefined;
    }

    getRuns(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}runs`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getRunById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}runs/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    saveRun(model: RunModel): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.post<RunModel>(`${environment.baseUrl}runs`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

    updateRun(model: RunModel): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        })
        return this.http.put<RunModel>(`${environment.baseUrl}runs/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

    deleteRun(id): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.delete<any>(`${environment.baseUrl}runs/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }

    getSortedsets(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}runs`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getSortedsetsByRunid(id): Observable<any> {

        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}sortedsets/run/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getSortedsetById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}sortedsets/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    saveSortedset(model: RunModel): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.post<RunModel>(`${environment.baseUrl}sortedsets`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

    updateSortedset(model: RunModel): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        })
        return this.http.put<RunModel>(`${environment.baseUrl}sortedsets/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

    deleteSortedset(id): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.delete<any>(`${environment.baseUrl}sortedsets/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }
}
