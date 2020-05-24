import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatsPage } from './stats.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: StatsPage,
    children: [
      {
        path: 'activities',
        loadChildren: () => import('./tabs/stats-activities/stats-activities.module').then( m => m.StatsActivitiesPageModule)
      },
      {
        path: 'overall',
        loadChildren: () => import('./tabs/stats-overall/stats-overall.module').then( m => m.StatsOverallPageModule)
      },
      {
        path: 'absurd',
        loadChildren: () => import('./tabs/stats-absurd/stats-absurd.module').then( m => m.StatsAbsurdPageModule)
      }
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/overall',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsPageRoutingModule {}
