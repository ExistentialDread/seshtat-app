import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiRoot = environment.apiRoot;
  constructor(private http: HttpClient) { }

  get<T>(url: string): Observable<T> {
      return this.http.get<T>(`${this.apiRoot}/${url}`);
  }

  post<T>(url: string, body: any): Observable<T> {
      return this.http.post<T>(`${this.apiRoot}/${url}`, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.apiRoot}/${url}`);
  }

  patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.apiRoot}/${url}`, body);
  }

}
