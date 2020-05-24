import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatsAbsurdPage } from './stats-absurd.page';

const routes: Routes = [
  {
    path: '',
    component: StatsAbsurdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsAbsurdPageRoutingModule {}
