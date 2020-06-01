import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OlympusPageRoutingModule } from './olympus-routing.module';

import { OlympusPage } from './olympus.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { MountainsPageModule } from 'src/app/modals/mountain/mountains/mountains.module';
import { StepDetailsPageModule } from 'src/app/modals/mountain/step-details/step-details.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    OlympusPageRoutingModule,
    MountainsPageModule,
    StepDetailsPageModule
  ],
  declarations: [OlympusPage]
})
export class OlympusPageModule {}
