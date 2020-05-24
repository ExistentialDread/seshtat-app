import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Day } from '@data/models';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class DayService {

  constructor(private api: ApiService) { }

  getFirstLast(): Observable<{first: string, last: string}> {
    return this.api.get<{first: string, last: string}>(`days/firstlast`);
  }

  getAll(): Observable<Day[]> {
    return this.api.get<Day[]>(`days`);
  }

  getDay(id: number): Observable<Day> {
    return this.api.get<Day>(`days/${id}`);
  }

  getCalendarDays(year: number, month: number): Observable<Day[]> {
     return this.api.get<Day[]>(`days/${year}/${month}`);
  }

  getDaysBetween(start: string, end: string): Observable<Day[]> {
    return this.api.get<Day[]>(`days/between/${start}/${end}`);
  }

  resetDay(id: number): Observable<string> {
    return this.api.get<string>(`days/reset/${id}`);
  }

  updateDay(id: number, day: Day): Observable<Day> {
    // Takeout unnecessary data
    const d = {date: day.date.format('YYYY-MM-DD'), conditionId: day.conditionId, records: []};
    for ( const r of day.records) {
      d.records.push({date: r.date, value: r.value, activityId: r.activityId});
    }
    return this.api.patch<Day>(`days/${id}`, d);
  }

  getRevoltState(): Observable<{ date: string, value: number}[]> {
    return this.api.get<{date: string, value: number}[]>(`days/revolt`);
  }
}
