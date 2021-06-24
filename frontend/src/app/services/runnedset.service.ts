import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RunnedSetModel } from '../models/runnedset-model';

@Injectable({
    providedIn: 'root'
  })
export class RunnedSetService {
    constructor(private http: HttpClient) {
    }

    createRunnedSet(model: RunnedSetModel): Observable<any> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      return this.http.post<RunnedSetModel>(`${environment.baseUrl}runnedsets`, model, { withCredentials: true, headers: headers, observe: 'response' });
  }

    getSetRunnedSets(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}runnedsets`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getRunnedSetsByRunid(id): Observable<any> {

      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}runnedsets/run/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
  }

    getRunnedSetById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}runnedsets/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }  
    
    getRunnedSetByExpectedSetId(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}runnedsets/expectedsetid/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    saveRunnedSet(model: RunnedSetModel): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.post<RunnedSetModel>(`${environment.baseUrl}runnedsets`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

    updateRunnedSet(model: RunnedSetModel): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        })
        return this.http.put<RunnedSetModel>(`${environment.baseUrl}runnedsets/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

    deleteRunnedSet(id): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.delete<any>(`${environment.baseUrl}runnedsets/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }


    
    

     getRunnedSetsBySetno(setno): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}runnedsets/setno/` + setno , { withCredentials: true, headers: httpHeader, observe: 'response' });
    } 

     getRunnedSetdataById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}runnedsets/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
      } 

}