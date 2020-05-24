import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Day, Activity, Condition, Record } from '@data/models';
import { Subscription } from 'rxjs';
import { ActivityService, DayService, ConditionService, SettingsService } from '@data/services';
import { AlertService, NavigationService } from '@core/services';
import { ModalController, AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { ActivitiesPage } from '../../activity/activities/activities.page';
import { ConditionsPage } from '../../condition/conditions/conditions.page';

@Component({
  selector: 'app-day-details',
  templateUrl: './day-details.page.html',
  styleUrls: ['./day-details.page.scss'],
})
export class DayDetailsPage implements OnInit, OnDestroy {
  @Input() day: Day;
  public dayCopy: Day;

  private subs: Subscription[] = [];
  private changed = false;
  private deepChange = false; // true if an activity or a condition has been changed
  public activities: Activity[];
  public conditions: Condition[];

  public faces;

  constructor(private activityService: ActivityService, private dayService: DayService,
              private conditionService: ConditionService, private alertService: AlertService,
              private modalCtrl: ModalController, private alertCtrl: AlertController,
              public navigationService: NavigationService, private settingsService: SettingsService) {
              }

  ngOnInit() {
    // close this modal regardless of changes if instructed to by the global close modals event
    const sub = this.navigationService.closeModalsEvent().subscribe(t => this.modalCtrl.dismiss());
    this.subs.push(sub);

    this.faces = this.settingsService.faces;

    // Fetch a copy of the day
    this.loadDay();
    // Fetch the activity list;
    this.loadActivities();
    // Fetch the condition list
    this.loadConditions();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  loadDay() {
    // TODO: Better to make a copy with json
    const sub = this.dayService.getDay(this.day.id).subscribe(day => {
      day.date = moment.utc(day.date);
      this.dayCopy = day;
    }, err => this.alertService.error(err));
    this.subs.push(sub);
  }

  loadActivities() {
    const sub = this.activityService.getActivities().subscribe(res => {
      res.forEach(activity => {
        activity.selected = (this.day.records && this.day.records.find(rec => rec.activityId === activity.id) != null);
      });
      this.activities = res;
    }, err => this.alertService.error(err));
    this.subs.push(sub);
  }

  loadConditions() {
    const sub = this.conditionService.getConditions().subscribe(res => {
      this.conditions = res;
      if (this.day.conditionId) {
        const condition = this.conditions.find(c => c.id === this.day.conditionId);
        if (condition) { condition.selected = true; } else { this.conditions[0].selected = true; }
      } else {
        this.conditions[0].selected = true;
      }
    });
    this.subs.push(sub);
  }

  async onChanges() {
    this.changed = true;
    // await this.rateDay();
  }

  applyChanges() {
    const c = this.conditions.find(cond => cond.selected);
    this.dayCopy.conditionId = c.id;
    this.dayCopy.condition = c;
    this.dayService.updateDay(this.day.id, this.dayCopy).subscribe(res => {
      this.day.rating = res.rating;
      this.day.records = res.records;
      this.day.conditionId = res.conditionId;
      this.day.condition = res.condition;
    }, err => this.alertService.error(err));
    this.modalCtrl.dismiss(this.deepChange);
  }

  async toggleActivity(selected: boolean, activityId: number) {
    const activity = this.activities.find(ac => ac.id === activityId);
    if (!selected) {
      const record: Record = { date: this.dayCopy.date.format('YYYY-MM-DD'), value: 0, activityId: activity.id, activity};
      if (activity.countable) {
        const alert = await this.alertCtrl.create({
          header: `${activity.title} Value`,
          inputs: [
            {
              name: 'value',
              type: 'number' as 'number',
            }
          ],
          buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
          }, {
            text: 'Ok',
            handler: async (alertData) => {
              record.value = (isNaN(parseFloat(alertData.value))) ? 0.0 : alertData.value;
              this.dayCopy.records.push(record);
              activity.selected = true;
              await this.onChanges();
            }
          }
        ]
        });
        await alert.present();

      } else { // activity not countable
        this.dayCopy.records.push(record);
        activity.selected = true;
        await this.onChanges();
      }

    } else {
      this.dayCopy.records = this.dayCopy.records.filter(rec => rec.activityId !== activity.id);
      activity.selected = false;
      await this.onChanges();
    }
  }

  async toggleCondition(selected: boolean, conditionId: number) {
    this.conditions.forEach(c => {
      if (c.id === conditionId) {
        c.selected = true;
        this.dayCopy.conditionId = c.id;
        this.dayCopy.condition = c;
      } else {
        c.selected = false;
      }
    });
    await this.onChanges();
  }

  async rateDay() {
    if (!this.dayCopy.condition) {
      const c = this.conditions.find(cond => cond.selected);
      this.dayCopy.conditionId = c.id;
      this.dayCopy.condition = c;
    }
    const sub = this.conditionService.rate(this.dayCopy).subscribe(r => {
      this.dayCopy.rating = r;
    }, err => this.alertService.error(err));
    this.subs.push(sub);
  }

  async resetDay() {
    const alert = await this.alertCtrl.create({
      header: 'Reset Day?',
      message: 'Are you sure you want to remove all data about this day?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Reset',
          handler: () => {
            this.dayService.resetDay(this.day.id).subscribe(mes => {
              this.day.rating = null;
              this.day.conditionId = null;
              this.day.records = [];
              this.modalCtrl.dismiss(this.deepChange);
            }, err => this.alertService.error(err));
          }
        }
      ]
    });

    await alert.present();
  }

  async openActivitiesModal() {
    const activities = this.activities;
    const modal = await this.modalCtrl.create({
      component: ActivitiesPage,
      componentProps: {
        activities
      },
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(changed => {
      if (changed.data) {
        this.deepChange = true;
        // Remove records for activities that no longer exist
        const records = this.dayCopy.records;
        let i = records.length;
        while (i--) {
          const record = records[i];
          if (!this.activities.find(ac => ac.id === record.activityId)) {
            // record has no corresponding activity, so delete it
            records.splice(i, 1);
          }
        }
      }
    });
    await modal.present();
  }

  async openConditionsModal() {
    const conditions = this.conditions;
    const modal = await this.modalCtrl.create({
      component: ConditionsPage,
      componentProps: {
        conditions
      },
      backdropDismiss: false,
    });
    await modal.present();
  }

  async closeModal() {
    if (!this.changed) {
      this.modalCtrl.dismiss(this.deepChange);
      return;
    }
    const alert = await this.alertCtrl.create({
      header: 'Save Changes?',
      message: 'All changes will be lost.',
      buttons: [
        {
          text: 'Discard',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.modalCtrl.dismiss(this.deepChange);
          }
        }, {
          text: 'Save',
          handler: () => {
            this.applyChanges();
          }
        }
      ]
    });

    await alert.present();
  }

}
