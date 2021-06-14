import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class OrderService {
   

    constructor(private http: HttpClient) {
    }

    getOrders(): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}orders`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getOrderById(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}orders/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getOrderitemsByOrderid(id: number) : Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        console.log(`${environment.baseUrl}orderitems/` + id)
        return this.http.get<any>(`${environment.baseUrl}orderitems/orderid/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
      }

    getOrderitemsByid(id: number) : Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        console.log(`${environment.baseUrl}orderitems/` + id)
        return this.http.get<any>(`${environment.baseUrl}orderitems/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
      }


}