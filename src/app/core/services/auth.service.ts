import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, defer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

import { User, AuthResponse } from '../models';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthResponse>(null);
  private apiRoot = 'auth';

  constructor(private api: ApiService, private storage: Storage) {
    this.storage.get('USER').then(user =>
    this.currentUserSubject.next(user));
   }

  register(user: User): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(`${this.apiRoot}/register`, user).pipe(tap(async (res: AuthResponse) => {
      if (res && res.token) {
        await this.storage.set('USER', res);
        this.currentUserSubject.next(res);
      }
    }));
  }

  login(user: User): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(`${this.apiRoot}/login`, user).pipe(tap(async (res: AuthResponse) => {
      if (res && res.token) {
        this.currentUserSubject.next(res);
        await this.storage.set('USER', res);
      }
    }));
  }

  forgotPassword(user: {email: string}): Observable<any> {
    return this.api.post<any>(`${this.apiRoot}/forgot-password`, user);
  }

  resetPassword(data: {userId: string, token: string, password: string}): Observable<any> {
    return this.api.post<any>(`${this.apiRoot}/reset-password`, data);
  }

  updateEmail(email: string): Observable<any> {
    return this.api.patch<any>(`${this.apiRoot}/update-email`, email).pipe(tap(async (res:any) => {
      const user = await this.storage.get('USER');
      user.email = email;
      this.storage.set('USER', user);
      this.currentUserSubject.next(user);
    }));
  }

  resetAccount(): Observable<any> {
    return this.api.get<any>(`${this.apiRoot}/reset`);
  }

  deleteAccount(): Observable<any> {
    return this.api.get<any>(`${this.apiRoot}/delete`).pipe(tap(async (res: any) => {
      await this.logout();
    }));
  }

  async logout() {
    await this.storage.remove('USER');
    await this.storage.remove('SETTINGS');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): Observable<boolean> {
    if (this.currentUserValue) { return of(true); }
    return defer(async () => {
      const user = await this.storage.get('USER');
      if (user) { return true; }
      return false;
    });
  }

  public get currentUserValue(): AuthResponse {
    return this.currentUserSubject.value;
  }
  public get currentUser() {
    return this.currentUserSubject;
  }
}

