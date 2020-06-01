import { Injectable } from '@angular/core';
import { ApiService } from '@core/services';
import { Step, Mountain } from '@data/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StepService {

  apiRoot = 'steps';

  public icons = {}


  constructor(private api: ApiService, public http: HttpClient) { }

  async getAll(): Promise<Step[]> {
    return this.api.get<Step[]>(this.apiRoot).toPromise();
  }

  async getAllMountains(): Promise<Mountain[]> {
    return this.api.get<Mountain[]>(`${this.apiRoot}/mountains`).toPromise();
  }

  async addStep(step: Step): Promise<Step> {
    //@ts-ignore
    step.paths = JSON.stringify(step.paths);
    //@ts-ignore
    step.actions = JSON.stringify(step.actions);
    return this.api.post<Step>(this.apiRoot, step).toPromise();
  }

  async removeStep(stepId: number): Promise<any> {
    return this.api.delete<any>(`${this.apiRoot}/${stepId}`).toPromise();
  }

  async updateStep(stepId: number, step: Partial<Step>): Promise<any> {
    //@ts-ignore
    step.paths = JSON.stringify(step.paths);
    //@ts-ignore
    step.actions = JSON.stringify(step.actions);
    return this.api.patch<any>(`${this.apiRoot}/${stepId}`, step).toPromise();
  }

  async addMountain(mountain: Mountain): Promise<Mountain> {
    return this.api.post<Mountain>(`${this.apiRoot}/mountains`, mountain).toPromise();
  }

  async removeMountain(mountainId: number): Promise<any> {
    return this.api.delete<any>(`${this.apiRoot}/mountains/${mountainId}`).toPromise();
  }

  async updateMountain(mountainId: number, mountain: Partial<Mountain>): Promise<any> {
    return this.api.patch<any>(`${this.apiRoot}/mountains/${mountainId}`, mountain).toPromise();
  }

  async loadIcon(icon): Promise<string> {
    if(this.icons[icon]) {
      return this.icons[icon];
    } else {
      const headers = new HttpHeaders();
      headers.set('Accept', 'image/svg+xml');
      const svg = await this.http.get(`assets/mountain/${icon}.svg`, { headers, responseType: 'text' }).toPromise(); 
      return svg.toString();
    }
  }
}
