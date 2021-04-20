import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PossiblesetModel } from '../models/possibleset-model';
import { OfferPropertiesModel } from '../models/offer_properties-model';
import { UserCategoryModel } from '../models/usercategory-model';

@Injectable({
    providedIn: 'root'
  })
export class OfferService {
    constructor(private http: HttpClient) {
    }

    getOffers(): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}offers/frominterest`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

    getOfferById(id): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}offers/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    } 

    deleteOffer(id): Observable<any> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      return this.http.delete<any>(`${environment.baseUrl}offers/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }

    getViewsByOfferid(id): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}offers_views/offer/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }  

    getStatusByOfferid(id): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}offers_status/offer/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }  

    getImagesbyOfferId(id): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}offers_images/offer/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }  

    getProprtiesByOfferId(id): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}offers_properties/offer/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }
    
    saveNewPossibleSets(model:PossiblesetModel): Observable<any> {
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
    
    getUserCategories(): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}offers_users_categories`, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }


    updateUserCategory(model: UserCategoryModel): Observable<any> {
      let headers = new HttpHeaders({
          'Content-Type': 'application/json',
      })
      return this.http.put<UserCategoryModel>(`${environment.baseUrl}offers_users_categories/userid/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
  }

    upsertProperties(model: OfferPropertiesModel): Observable<any> {
      console.log(model);
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      return this.http.post<OfferPropertiesModel>(`${environment.baseUrl}offers_properties`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

    deletePossibleSetBySetId(id): Observable<any> {
      console.log(id)
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      return this.http.delete<any>(`${environment.baseUrl}offers_possiblesets/` + id, { withCredentials: true, headers: headers, observe: 'response' });
    }

  
}  