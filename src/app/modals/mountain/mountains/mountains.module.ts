import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { MountainsPage } from './mountains.page';
import { MountainDetailsPageModule } from '../mountain-details/mountain-details.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MountainDetailsPageModule
  ],
  declarations: [MountainsPage],
  entryComponents: [MountainsPage]
})
export class MountainsPageModule {}
