import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform, ToastController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationStart, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService, AuthService, NavigationService } from './core/services';
import { Location, registerLocaleData } from '@angular/common';
import { SettingsService } from '@data/services/settings.service';
import { Settings } from '@data/models/settings';
import { SigninModal, SignupModal } from './modals/user';
import { SettingsPage } from './modals/settings/settings.page';
import { CalendarService, CacheService } from '@data/services';
import { ActivitiesPage } from './modals/activity/activities/activities.page';
import { ConditionsPage } from './modals/condition/conditions/conditions.page';

import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public user;
  private subs: Subscription[] = [];

  public calendar = false;
  public currentDate;

  public ageTimer = { birthdate: null, timer: 0, year: '', fraction: '', interval: null };

  public settings;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,

    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private router: Router,
    private alertService: AlertService,

    private authService: AuthService,
    private settingsService: SettingsService,
    private navigationService: NavigationService,
    public calendarService: CalendarService,
    private cache: CacheService,

    private location: Location,

  ) {
    // Check if we are in calendar to show the special toolbar
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.calendar = (event.url === '/calendar');
      }
    });
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    // Get the user if logged in
    let sub = this.authService.currentUser.subscribe(user => {
      this.user = user;
      if (user) {
        this.settingsService.load().subscribe(s => s);
      }
    });
    this.subs.push(sub);

    // Display the alert messages
    sub = this.alertService.getMessage().subscribe(message => {
      if(message && message.text) {
        this.toastCtrl.create({
          message: message.text,
          duration: 5000,
          // color: (message.type === 'success') ? 'success' : 'warning'
        }).then(toast => toast.present());
      }
    });
    this.subs.push(sub);

    // Makesure back button closes the modal if open
    sub = this.router.events.subscribe(async (event: any) => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          const modal = await this.modalCtrl.getTop();
          if (modal) {
            modal.dismiss();
            this.location.forward();
          }
        }
      }
    });

    this.subs.push(sub);

    // Update the settings if they changed
    sub = this.settingsService.CurrentSettings.subscribe((settings: Settings) => {
      if (settings) {
        this.settings = settings;
        // Update colors and check for ageTimer
        const { addons } = settings;
        this.settingsService.applyColors();
        // get the birthdate to show for the age timer
        if (addons.existentialDread.enabled && addons.ageTimer.enabled) {
          this.ageTimer.birthdate = moment(addons.ageTimer.birthday);
          this.computeAgeTimer();
        } else {
          if (this.ageTimer.interval) {
            clearInterval(this.ageTimer.interval);
          }
          this.ageTimer.birthdate = null;
        }

        // Dark mode
        if (settings.darkMode !== undefined) {
          document.body.classList.toggle('dark', settings.darkMode);
        }
      }
    });
    this.subs.push(sub);

    // get calendar month if necessary
    sub = this.calendarService.currentDate$.subscribe(date => {
      this.currentDate = date;
    });
    this.subs.push(sub);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  async openRegister() {
    const modal = await this.modalCtrl.create({
      component: SignupModal
    });
    if (modal) {
      modal.onDidDismiss().then(login => {
        if (login.data) { this.openLogin(); }
      });
      await modal.present();
    }
  }

  async openLogin() {
    const modal = await this.modalCtrl.create({
      component: SigninModal
    });
    if (modal) {
      modal.onDidDismiss().then(register => {
        if (register.data) { this.openRegister(); }
      });
      await modal.present();
    }
  }

  async openActivities() {
    const modal = await this.modalCtrl.create({
      component: ActivitiesPage
    });
    await modal.present();
  }

  async openConditions() {
    const modal = await this.modalCtrl.create({
      component: ConditionsPage
    });
    await modal.present();
  }

  async openSettings() {
    const modal = await this.modalCtrl.create({
      component: SettingsPage,
      // backdropDismiss: false,
    });
    if (modal) {
      modal.onDidDismiss().then(res => {
        if (res.data) {
          // settings changed
        }
      });
      await modal.present();
    }
  }

  async logout() {
    await this.authService.logout();
    this.cache.clearCache();
    this.goTo('/home');
  }

  async goTo(url: string) {
    this.navigationService.goTo(url);
  }

  computeAgeTimer() {
    if (this.ageTimer.interval) {
      clearInterval(this.ageTimer.interval);
    }
    let timerString;

    this.ageTimer.timer = moment().diff(this.ageTimer.birthdate, 'years', true);
    this.ageTimer.interval = setInterval(() => {
      this.ageTimer.timer += 0.00000001;
      timerString = this.ageTimer.timer.toFixed(8).split('.');
      this.ageTimer.year = timerString[0];
      this.ageTimer.fraction = timerString[1];
    }, 31);
  }
}
