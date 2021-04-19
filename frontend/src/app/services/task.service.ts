import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TaskModel } from '../models/task-model';

@Injectable({
    providedIn: 'root'
  })
export class TaskService {
    constructor(private http: HttpClient) {
    }

    createDownloadSetTask(model: TaskModel): Observable<any> {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      })
      return this.http.post<TaskModel>(`${environment.baseUrl}tasks`, model, { withCredentials: true, headers: headers, observe: 'response' });
    }

    getProgressDetails(requestIds): Observable<any> {
      let httpHeader = new HttpHeaders();
      httpHeader.set("Access-Control-Allow-Origin", "*");
      return this.http.get<any>(`${environment.baseUrl}progressdetails/` + requestIds, { withCredentials: true, headers: httpHeader, observe: 'response' });
    }

  
}