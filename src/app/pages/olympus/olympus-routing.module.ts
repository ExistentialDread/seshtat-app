import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OlympusPage } from './olympus.page';

const routes: Routes = [
  {
    path: '',
    component: OlympusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OlympusPageRoutingModule {}
