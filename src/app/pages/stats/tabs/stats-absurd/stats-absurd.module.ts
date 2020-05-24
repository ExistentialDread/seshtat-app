import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NgxEchartsModule } from 'ngx-echarts';

import { StatsAbsurdPageRoutingModule } from './stats-absurd-routing.module';

import { StatsAbsurdPage } from './stats-absurd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxEchartsModule,
    StatsAbsurdPageRoutingModule
  ],
  declarations: [StatsAbsurdPage]
})
export class StatsAbsurdPageModule {}
