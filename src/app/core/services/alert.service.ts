import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private subject = new Subject<any>();

  constructor() { }

  success(message: string) {
    this.subject.next({type : 'success', text: message});
  }

  error(error) {
    let message = (error.message) ? error.message : (error.error && error.error.message) ? error.error.message : error.error;
    if (message === undefined) { message = error; }

    console.log(error);

    this.subject.next({type: 'error', text: message});
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
