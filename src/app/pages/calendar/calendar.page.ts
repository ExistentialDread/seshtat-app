import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Settings } from '@data/models/settings';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { SettingsService, CalendarService, CacheService } from '@data/services';
import { Day } from '@data/models';
import { LoadingController, ModalController } from '@ionic/angular';
import { AlertService } from '@core/services';
import { DayDetailsPage } from '../../modals/day/day-details/day-details.page';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  public settings: Settings;
  public currentMonth: moment.Moment;
  public days: Day[][] = [];
  public weekDays: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  public firstDayOfWeek: number;

  // flag to make sure we only ask for days once at a time
  private waitingForResponse = false;

  constructor(private settingsService: SettingsService,
              private calendarService: CalendarService,
              private cache: CacheService,
              private loadingCtrl: LoadingController,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    // subscribe if the date changes
    let sub = this.calendarService.currentDate$.subscribe(async (date: moment.Moment) => {
      if (date) {
        this.currentMonth = date;
        // Fetch the data
        await this.getCalendarDays();
      }
    });
    this.subs.push(sub);

    // subscribe to fetch the data in the route
    sub = this.route.params.subscribe(params => {
      // Check if we use the current date or another one given route params
      let currentMonth = moment();
      let year = parseInt(params.year, 10);
      let month = parseInt(params.month, 10);
      let day = parseInt(params.day, 10);
      year = (isNaN(year)) ? currentMonth.get('year') : year;
      month = (isNaN(month)) ? currentMonth.get('month') : month;
      day = (isNaN(day)) ? currentMonth.get('date') : day;

      currentMonth = moment.utc([year, month, day]);

      // inform everyone of the date change
      this.calendarService.setDate(currentMonth);


    });
    this.subs.push(sub);

    // subscribe if the settings changes (firstdayofweek)
    sub = this.settingsService.CurrentSettings.subscribe((settings: Settings) => {
      if (!settings) { return; }
      this.settings = settings;
      let firstDay = this.settings.firstDayOfWeek;
      firstDay = +firstDay;
      if (this.firstDayOfWeek === undefined || this.firstDayOfWeek !== firstDay) {
        if (this.firstDayOfWeek !== firstDay) {
          // first day of week changed, we need to reload the data
          this.cache.clearCache();
        }
        this.firstDayOfWeek = firstDay;
        const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        for (let i = 0; i < 7; i++) {
          this.weekDays[i] = weekDays[(i + this.firstDayOfWeek) % 7];
        }
      }
    });
    this.subs.push(sub);

    // subscribe if the cache is cleared
    sub = this.cache.clearCache$.subscribe(async () => {
      await this.getCalendarDays();
    });
    this.subs.push(sub);
  }

  async getCalendarDays() {
    const year = this.currentMonth.get('year');
    const month = this.currentMonth.get('month');
    const cachedDays = this.cache.getCalendarDays(year, month);
    if (cachedDays) {
      this.days = cachedDays;
      return;
    }

    if (this.waitingForResponse) { return ; }
    this.waitingForResponse = true;

    const loading = await this.loadingCtrl.create({message: 'Please wait...'});
    await loading.present();

    try {
      const days = await this.calendarService.getCalendarDays(year, month).toPromise();
      // transform date from string to moment object
      days.forEach(d => {
        d.date = moment.utc(d.date);
      });
      this.days = this.daysToCalendarRows(days);
      this.cache.addToCache(year, month, this.days);
      loading.dismiss();
    } catch (ex) {
      loading.dismiss();
      this.alertService.error(ex);
    } finally {
      this.waitingForResponse = false;
    }
  }

  daysToCalendarRows(days: Day[]): Day[][] {
    const calendarDays: Day[][] = [];
    const nbrRows = days.length / 7;
    for (let i = 0; i < nbrRows; i++) {
      calendarDays.push(days.slice(i * 7, (i * 7) + 7));
    }
    return calendarDays;
  }

  async onDaySelected(day: Day) {
    const modal = await this.modalCtrl.create({
      component: DayDetailsPage,
      componentProps: {
        day
      },
      backdropDismiss: false,
    });
    await modal.present();
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

}
