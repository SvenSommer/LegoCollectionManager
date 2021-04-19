import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CollectionModel } from '../models/collection-model';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private http: HttpClient) {
  }

  getCollections(): Observable<any> {
    let httpHeader = new HttpHeaders();
    httpHeader.set("Access-Control-Allow-Origin", "*");
    return this.http.get<any>(`${environment.baseUrl}collections`, { withCredentials: true, headers: httpHeader, observe: 'response' });
  }

  getCollectionById(id): Observable<any> {
    let httpHeader = new HttpHeaders();
    httpHeader.set("Access-Control-Allow-Origin", "*");
    return this.http.get<any>(`${environment.baseUrl}collections/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
  }

  saveCollection(model: CollectionModel): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.post<CollectionModel>(`${environment.baseUrl}collections`, model, { withCredentials: true, headers: headers, observe: 'response' });
  }

  updateCollection(model: CollectionModel): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.put<CollectionModel>(`${environment.baseUrl}collections/` + model.id, model, { withCredentials: true, headers: headers, observe: 'response' });
  }

  getRuns(collectionid) {
    let httpHeader = new HttpHeaders();
    httpHeader.set("Access-Control-Allow-Origin", "*");
    return this.http.get<any>(`${environment.baseUrl}runs/collection/` + collectionid, { withCredentials: true, headers: httpHeader, observe: 'response' });
  }

  getRunsNextnoByCollectionid(collectionid) {
    let httpHeader = new HttpHeaders();
    httpHeader.set("Access-Control-Allow-Origin", "*");
    return this.http.get<any>(`${environment.baseUrl}runs/collection/` + collectionid + '/nextno', { withCredentials: true, headers: httpHeader, observe: 'response' });
  }

  getExpectedSets(id) {
    let httpHeader = new HttpHeaders();
    httpHeader.set("Access-Control-Allow-Origin", "*");
    return this.http.get<any>(`${environment.baseUrl}expectedsets/collection/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
  }

  deleteExpectedSetBySetId(id): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.delete<any>(`${environment.baseUrl}expectedsets/` + id, { withCredentials: true, headers: headers, observe: 'response' });
  }

  getSuggestedSets(id) {
    let httpHeader = new HttpHeaders();
    httpHeader.set("Access-Control-Allow-Origin", "*");
    return this.http.get<any>(`${environment.baseUrl}suggestedsets/collection/` + id, { withCredentials: true, headers: httpHeader, observe: 'response' });
  }

  getExpectedParts(id) {
    let httpHeader = new HttpHeaders();
    httpHeader.set("Access-Control-Allow-Origin", "*");
    return this.http.get<any>(`${environment.baseUrl}subsetdata/collection/` + id + '/parts', { withCredentials: true, headers: httpHeader, observe: 'response' });
  }
  getUnsettedParts(id) {
    let httpHeader = new HttpHeaders();
    httpHeader.set("Access-Control-Allow-Origin", "*");
    return this.http.get<any>(`${environment.baseUrl}identifiedparts/collection/` + id + '/unsetted', { withCredentials: true, headers: httpHeader, observe: 'response' });
  }
  getExpectedMinifigs(id) {
    let httpHeader = new HttpHeaders();
    httpHeader.set("Access-Control-Allow-Origin", "*");
    return this.http.get<any>(`${environment.baseUrl}subsetdata/collection/` + id + '/minifigs', { withCredentials: true, headers: httpHeader, observe: 'response' });
  }

  saveNewSets(model): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.post<CollectionModel>(`${environment.baseUrl}expectedsets`, model, { withCredentials: true, headers: headers, observe: 'response' });
  }

  deleteCollection(id): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.delete<any>(`${environment.baseUrl}collections/` + id, { withCredentials: true, headers: headers, observe: 'response' });
  }
}
