import { Injectable } from '@angular/core';
import { ApiService } from '@core/services';
import { Step } from '@data/models';

@Injectable({
  providedIn: 'root'
})
export class StepService {
  Steps: Step[] = [
  ]

  constructor(private api: ApiService) { }

  async getAll(): Promise<Step[]> {
    return this.Steps;
  }
}
