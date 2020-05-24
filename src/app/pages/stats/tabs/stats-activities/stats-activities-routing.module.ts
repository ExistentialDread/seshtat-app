import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatsActivitiesPage } from './stats-activities.page';

const routes: Routes = [
  {
    path: '',
    component: StatsActivitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsActivitiesPageRoutingModule {}
