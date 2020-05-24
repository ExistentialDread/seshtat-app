import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Activity } from '@data/models';
import { Subscription } from 'rxjs';
import { ActivityService, IconService, CacheService } from '@data/services';
import { ModalController } from '@ionic/angular';
import { AlertService, NavigationService } from '@core/services';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.page.html',
  styleUrls: ['./activity-details.page.scss'],
})
export class ActivityDetailsPage implements OnInit, OnDestroy {

  @Input() activity: Activity;
  public activityCopy: Activity = {};
  public edit = false;
  public changed = false;
  private subs: Subscription[] = [];

  public icons;

  constructor(private activityService: ActivityService, private modalCtrl: ModalController,
              private alertService: AlertService,
              private iconService: IconService, public navigationService: NavigationService,
              public cache: CacheService) {
   }

  ngOnInit() {
    // close this modal if instructed to by the close modals event
    const sub = this.navigationService.closeModalsEvent().subscribe(t => this.modalCtrl.dismiss());
    this.subs.push(sub);

    if (this.activity) {
      this.edit = true;
      Object.assign(this.activityCopy, this.activity);
      delete this.activityCopy.selected;
    } else {
      this.activity = {};
      this.activityCopy.icon = 'fitness';
    }
    this.icons = this.iconService.getIconsList();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onChanges() {
    this.changed = true;
  }

  async updateActivity() {
    try {
      if (this.changed) {
        const activity = await this.activityService.updateActivity(this.activity.id, this.activityCopy).toPromise();
        Object.assign(this.activity, activity);
        this.activity.title = activity.title;
        this.cache.clearCache();
        await this.closeModal(true);
      } else {
        await this.closeModal();
      }
    } catch (err) {
      this.alertService.error(err);
    }
  }

  async createActivity() {
    try {
      if (this.changed) {
        const activity = await this.activityService.createActivity(this.activityCopy).toPromise();
        Object.assign(this.activity, activity);
        await this.closeModal(this.activity);
      } else {
        await this.closeModal();
      }
    } catch (err) {
      this.alertService.error(err);
    }
  }

  setIcon(icon: string) {
    this.activityCopy.icon = icon;
    this.changed = true;
  }

  async closeModal(data = null) {
    this.modalCtrl.dismiss(data);
  }

}
