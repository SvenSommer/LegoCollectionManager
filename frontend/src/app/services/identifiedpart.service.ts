import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IdentifiedPartDBModel } from '../models/identifiedpartdb-model';

@Injectable({
    providedIn: 'root'
  })
export class IdentifiedpartService {
    constructor(private http: HttpClient) {
    }
      
    getIdentifiedpartByRunid(id): Observable<any> {

        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}identifiedparts/run/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    } 

    getScreenedPartsByRunid(id): Observable<any> {

        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}identifiedparts/run/` + id + `/screened`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getIdentifiedpartById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}identifiedparts/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    createIdentifiedpart(model: IdentifiedPartDBModel): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
          })
          return this.http.post<IdentifiedPartDBModel>(`${environment.baseUrl}identifiedparts`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

    saveIdentifiedpart(model: IdentifiedPartDBModel): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.post<IdentifiedPartDBModel>(`${environment.baseUrl}identifiedparts`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }
  
    updatetIdentifiedpart(model: IdentifiedPartDBModel): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        })
        return this.http.put<IdentifiedPartDBModel>(`${environment.baseUrl}identifiedparts/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

    deleteLabelInformation(id): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.delete<any>(`${environment.baseUrl}identifiedparts/` + id + `/unlabel`, { withCredentials: true, headers: headers, observe: 'response' });
    }
  
    deleteIdentifiedpart(id): Observable<any> {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.delete<any>(`${environment.baseUrl}identifiedparts/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }

    markIdentifiedpartAsDeletedById(id): Observable<any> {
        console.log("DELETE identifiedpartid = " + id)
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        })
        return this.http.delete<any>(`${environment.baseUrl}identifiedparts/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }

    getPartdata(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}partdata`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }
    
    getColordata(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}colors`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }
}