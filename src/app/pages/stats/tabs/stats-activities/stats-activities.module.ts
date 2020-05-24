import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatsActivitiesPageRoutingModule } from './stats-activities-routing.module';

import { StatsActivitiesPage } from './stats-activities.page';
import { ComponentsModule } from 'src/app/components/components.module';

import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxEchartsModule,
    StatsActivitiesPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [StatsActivitiesPage]
})
export class StatsActivitiesPageModule {}
