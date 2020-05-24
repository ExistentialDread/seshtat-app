import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { ColorPickPage } from './color-pick.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [ColorPickPage],
  entryComponents: [ColorPickPage]
})
export class ColorPickPageModule {}
