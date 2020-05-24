import { Injectable } from '@angular/core';
import { ApiService } from '@core/services';
import { Record } from '@data/models/record';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(private api: ApiService) { }

  add(rec: Record): Observable<Record> {
    return this.api.post<Record>('records', rec);
  }

  update(id: number, value: Partial<Record>): Observable<any> {
    return this.api.post<any>(`records/${id}`, value);
  }

  delete(id: number): Observable<any> {
    return this.api.delete<any>(`records/${id}`);
  }

  getActivityRecordsBetween(activityId: number, start: string, end: string): Observable<Record[]> {
    return this.api.get<Record[]>(`records/activity/${activityId}/${start}/${end}`);
  }

  getActivityRecords(activityId: number): Observable<Record[]> {
    return this.api.get<Record[]>(`records/activity/${activityId}`);
  }
}
