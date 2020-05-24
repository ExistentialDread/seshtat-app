import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OlympusPageRoutingModule } from './olympus-routing.module';

import { OlympusPage } from './olympus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OlympusPageRoutingModule
  ],
  declarations: [OlympusPage]
})
export class OlympusPageModule {}
