
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IconToggleComponent } from 'src/app/components/icon-toggle/icon-toggle.component';
import { DayComponent } from './day/day.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [IconToggleComponent, DayComponent],
  exports: [IconToggleComponent, DayComponent]
})
export class ComponentsModule {}
