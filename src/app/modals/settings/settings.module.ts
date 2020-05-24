import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPage } from './settings.page';
import { ColorPickPageModule } from '../color-pick/color-pick.module';
import { UpdateAccountPageModule } from '../user/update-account/update-account.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColorPickPageModule,
    UpdateAccountPageModule,
  ],
  declarations: [SettingsPage],
  entryComponents: [SettingsPage]
})
export class SettingsPageModule {}
