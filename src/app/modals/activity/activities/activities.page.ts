import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Activity } from '@data/models';
import { Subscription } from 'rxjs';
import { ActivityService, CacheService } from '@data/services';
import { AlertService, NavigationService } from '@core/services';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivityDetailsPage } from '../activity-details/activity-details.page';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit, OnDestroy {

  @Input() activities: Activity[];
  private subs: Subscription[] = [];
  private changed = false;

  constructor(private activityService: ActivityService, private alertService: AlertService,
              private modalCtrl: ModalController, private alertCtrl: AlertController,
              public navigationService: NavigationService, private cache: CacheService) { }

  ngOnInit() {
    // close this modal if instructed to by the close modals event
    let sub = this.navigationService.closeModalsEvent().subscribe(t => this.modalCtrl.dismiss());
    this.subs.push(sub);

    if (!this.activities) {
      sub = this.activityService.getActivities().subscribe(activities => {
        this.activities = activities;
      }, err => this.alertService.error(err));
      this.subs.push(sub);
    }
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  notifyChanges() {
    this.changed = true;
  }

  async onDeleteActivity(event: Event, activity: Activity, index: number) {
    event.stopPropagation();

    const alert = await this.alertCtrl.create({
      header: `Delete ${activity.title}?`,
      message: 'All records and condition requirements related to this activity will be lost!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Delete',
          handler: async () => {
            const sub = this.activityService.deleteActivity(activity.id).subscribe(deleted => {
              this.activities.splice(index, 1);
              this.notifyChanges();
            }, err => this.alertService.error(err));
            this.subs.push(sub);
          }
        }
      ]
    });

    await alert.present();
  }

  async onSelectActivity(activity: Activity) {
    const modal = await this.modalCtrl.create({
      component: ActivityDetailsPage,
      componentProps: {
        activity
      },
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(changed => {
      if (changed.data as boolean) {
        this.notifyChanges();
      }
    });
    await modal.present();
  }

  async onAddActivity() {
    const modal = await this.modalCtrl.create({
      component: ActivityDetailsPage,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(changed => {
      if (changed.data as Activity) {
        this.activities.push(changed.data);
        // no need to clear cache
        this.changed = true;
      }
    });
    await modal.present();
  }

  async closeModal() {
    this.modalCtrl.dismiss(this.changed);
  }
}
