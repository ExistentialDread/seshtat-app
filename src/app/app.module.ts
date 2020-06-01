import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from '@core/interceptors';
import { CoreModule } from './core';
import { SigninModalModule, SignupModalModule, ResetPasswordModalModule } from './modals/user';
import { SettingsPageModule } from './modals/settings/settings.module';
import { ActivitiesPageModule } from './modals/activity/activities/activities.module';
import { ActivityDetailsPageModule } from './modals/activity/activity-details/activity-details.module';
import { ConditionDetailsPageModule } from './modals/condition/condition-details/condition-details.module';
import { ConditionsPageModule } from './modals/condition/conditions/conditions.module';
import { RequirementsPageModule } from './modals/condition/requirements/requirements.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
            HttpClientModule,
            CoreModule, SigninModalModule, SignupModalModule, ResetPasswordModalModule, SettingsPageModule,
            ActivitiesPageModule, ActivityDetailsPageModule, ConditionsPageModule, ConditionDetailsPageModule,
            RequirementsPageModule],

  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
