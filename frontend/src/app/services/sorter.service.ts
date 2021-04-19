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

  getSorterById(id): Observable<any> {
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

  updateSorter(model: SorterModel): Observable<any> {
      let headers = new HttpHeaders({
          'Content-Type': 'application/json',
      })
      return this.http.put<SorterModel>(`${environment.baseUrl}sorters/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
  }

  deleteSorter(id): Observable<any> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      return this.http.delete<any>(`${environment.baseUrl}sorters/` + id, { withCredentials: true, headers: headers, observe: 'response' });
  }

  getPushers(id) {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}pushers/sorter/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
  }

  getPusherById(id): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}pushers/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
  }

  savePusher(model: SorterModel): Observable<any> {
    let headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
    })
    return this.http.post<SorterModel>(`${environment.baseUrl}pushers`, model, { withCredentials: true, headers: headers, observe: 'response' });
  }

  updatePusher(model: SorterModel): Observable<any> {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
    })
    return this.http.put<SorterModel>(`${environment.baseUrl}pushers/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
  }
  
  deletePusher(id): Observable<any> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      return this.http.delete<any>(`${environment.baseUrl}pushers/` + id, { withCredentials: true, headers: headers, observe: 'response' });
  }

  getValves(id) {
    let httpHeader = new HttpHeaders();
    httpHeader.set("Access-Control-Allow-Origin", "*");
    return this.http.get<any>(`${environment.baseUrl}valves/sorter/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
  }

  getValveById(id): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}valves/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
  }

  saveValve(model: SorterModel): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.post<SorterModel>(`${environment.baseUrl}valves`, model, { withCredentials: true, headers: headers, observe: 'response' });
  }

  updateValve(model: SorterModel): Observable<any> {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
    })
    return this.http.put<SorterModel>(`${environment.baseUrl}valves/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
  }
  
  deleteValve(id): Observable<any> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      return this.http.delete<any>(`${environment.baseUrl}valves/` + id, { withCredentials: true, headers: headers, observe: 'response' });
  }

  getScales(id) {
    let httpHeader = new HttpHeaders();
    httpHeader.set("Access-Control-Allow-Origin", "*");
    return this.http.get<any>(`${environment.baseUrl}scales/sorter/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
  }

  getScaleById(id): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}scales/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
  }

  saveScale(model: SorterModel): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.post<SorterModel>(`${environment.baseUrl}scales`, model, { withCredentials: true, headers: headers, observe: 'response' });
  }

  updateScale(model: SorterModel): Observable<any> {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
    })
    return this.http.put<SorterModel>(`${environment.baseUrl}scales/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
  }
  
  deleteScale(id): Observable<any> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      return this.http.delete<any>(`${environment.baseUrl}scales/` + id, { withCredentials: true, headers: headers, observe: 'response' });
  }
  
}