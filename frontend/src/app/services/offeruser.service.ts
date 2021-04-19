import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PossiblesetModel } from '../models/possibleset-model';
import { OfferPropertiesModel } from '../models/offer_properties-model';

@Injectable({
    providedIn: 'root'
  })
export class OfferUserService {
    constructor(private http: HttpClient) {
    }
    
    getUserDetail(id): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}offers_users/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    } 
    
    getOffersByUserId(id): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}offers/userid/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    } 


}