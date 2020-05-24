import { Injectable } from '@angular/core';
import { ApiService } from '@core/services';
import { Observable } from 'rxjs';

import { Activity } from '@data/models';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiRoot = 'activities';

  constructor(private api: ApiService) { }

  getActivities(): Observable<Activity[]> {
    return this.api.get<Activity[]>(this.apiRoot);
  }

  createActivity(activity: Partial<Activity>): Observable<Activity> {
    return this.api.post<Activity>(this.apiRoot, activity);
  }

  updateActivity(id: number, activity: Partial<Activity>): Observable<Activity> {
    return this.api.patch<Activity>(`${this.apiRoot}/${id}`, activity);
  }

  deleteActivity(id: number): Observable<boolean> {
    return this.api.delete(`${this.apiRoot}/${id}`);
  }

}
