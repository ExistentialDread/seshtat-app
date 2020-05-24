import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import * as moment from 'moment';
import { ApiService } from '@core/services';
import { Day } from '@data/models';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  public currentDate$ = new BehaviorSubject<moment.Moment>(null);
  private currentDate: moment.Moment;

  constructor(private api: ApiService) { }

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

  setDate(date: moment.Moment) {
    this.currentDate = date;
    this.currentDate$.next(this.currentDate);
  }

  async getNextMonth() {
    this.currentDate$.next(this.currentDate.add({months: 1})); // month++;
  }

  async getPreviousMonth() {
    this.currentDate$.next(this.currentDate.subtract({months: 1})); // month++;

  }

  async getCurrentMonth() {
    this.currentDate$.next(moment.utc());
  }
}
