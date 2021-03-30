import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PossiblesetModel } from '../models/possibleset-model';

@Injectable({
    providedIn: 'root'
  })
export class OfferService {
    constructor(private http: HttpClient) {
    }

    getOffers(): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}offers`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getOfferById(id): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}offers/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    } 

    getViewsByOfferid(id): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}offers_views/offer/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }  

    
    saveNewPossibleSets(model): Observable<any> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      return this.http.post<PossiblesetModel>(`${environment.baseUrl}offers_possiblesets`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

    getPossiblesetsByOfferid(id): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}offers_possiblesets/offer/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    deletePossibleSetBySetId(id): Observable<any> {
      console.log(id)
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      return this.http.delete<any>(`${environment.baseUrl}offers_possiblesets/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }
}