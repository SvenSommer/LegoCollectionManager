import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PurchasedPartModel } from '../models/purchasedpart-model';

@Injectable({
    providedIn: 'root'
  })
export class PurchasedPartService {
 
    constructor(private http: HttpClient) {
    }

    getPurchasedPartsOrderItembyId(id: number) : Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}purchasedparts/orderitemid/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    UpsertPurchasedPart(model: PurchasedPartModel): Observable<any> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      console.log(model)
      return this.http.post<PurchasedPartModel>(`${environment.baseUrl}purchasedparts`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

}