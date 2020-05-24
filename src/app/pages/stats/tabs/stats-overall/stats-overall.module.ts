import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatsOverallPageRoutingModule } from './stats-overall-routing.module';

import { StatsOverallPage } from './stats-overall.page';

import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxEchartsModule,
    StatsOverallPageRoutingModule
  ],
  declarations: [StatsOverallPage]
})
export class StatsOverallPageModule {}
