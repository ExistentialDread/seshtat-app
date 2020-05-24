import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConditionDetailsPage } from './condition-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [ConditionDetailsPage],
  entryComponents: [ConditionDetailsPage]
})
export class ConditionDetailsPageModule {}
