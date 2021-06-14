import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class MissingPartService {

    constructor(private http: HttpClient) {
    }

    getMissingPartsBySetId(id): Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        return this.http.get<any>(`${environment.baseUrl}missingparts/expectedsetid/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
      }

      getMissingitemsByPartNoAndColor(no: any, color_id: any) : Observable<any> {
        let httpHeader = new HttpHeaders();
        httpHeader.set("Access-Control-Allow-Origin", "*");
        console.log(`${environment.baseUrl}missingparts/partno/` + no +`/colorid/` + color_id)
        return this.http.get<any>(`${environment.baseUrl}missingparts/partno/` + no +`/colorid/` + color_id, { withCredentials: true, headers: httpHeader, observe: 'response' });
      }

}