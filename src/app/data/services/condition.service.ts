import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Condition, Day, Requirement } from '@data/models';
import { ApiService } from '@core/services';

@Injectable({
  providedIn: 'root'
})
export class ConditionService {
  private apiRoot = 'conditions';

  constructor(private api: ApiService) { }

  getConditions(): Observable<Condition[]> {
    return this.api.get<Condition[]>(this.apiRoot);
  }

  getConditionById(id: number): Observable<Condition> {
    return this.api.get<Condition>(`${this.apiRoot}/${id}`);
  }

  createCondition(condition: Partial<Condition>): Observable<Condition> {
    // clean the condition object
    const data: Condition = {
      title: condition.title,
      icon: condition.icon,
      grading: condition.grading
    };
    // clean requirements and simpleConditions
    this.cleanGrade(data.grading.great);
    this.cleanGrade(data.grading.good);
    this.cleanGrade(data.grading.meh);
    this.cleanGrade(data.grading.bad);

    return this.api.post<Condition>(this.apiRoot, condition);
  }

  updateCondition(id: number, condition: Partial<Condition>): Observable<Condition> {
    // clean the condition object
    const data: Condition = {
      title: condition.title,
      icon: condition.icon,
      grading: condition.grading
    };
    // clean requirements and simpleConditions
    this.cleanGrade(data.grading.great);
    this.cleanGrade(data.grading.good);
    this.cleanGrade(data.grading.meh);
    this.cleanGrade(data.grading.bad);

    return this.api.patch<Condition>(`${this.apiRoot}/${id}`, condition);
  }

  deleteCondition(id: number): Observable<boolean> {
    return this.api.delete(`${this.apiRoot}/${id}`);
  }

  rate(day: Day): Observable<string> {
    return this.api.post<string>(`${this.apiRoot}/rate`, day);
  }

  rateDay(id: number): Observable<Day> {
    return this.api.get<Day>(`${this.apiRoot}/rate/${id}`);
  }

  private cleanGrade(grade: Requirement[]) {
    for (const requirement of grade) {
      for (const simpleCondition of requirement) {
        delete simpleCondition.activity;
      }
    }

  }
}
