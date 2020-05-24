import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Condition } from '@data/models';
import { Subscription } from 'rxjs';
import { ConditionService, CacheService } from '@data/services';
import { NavigationService, AlertService } from '@core/services';
import { AlertController, ModalController } from '@ionic/angular';
import { ConditionDetailsPage } from '../condition-details/condition-details.page';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.page.html',
  styleUrls: ['./conditions.page.scss'],
})
export class ConditionsPage implements OnInit, OnDestroy {
  @Input() conditions: Condition[];
  private subs: Subscription[] = [];
  private changed = false;

  constructor(private conditionService: ConditionService, public navigationService: NavigationService,
              private alertService: AlertService, private alertCtrl: AlertController,
              private modalCtrl: ModalController, private cache: CacheService) { }

  ngOnInit() {
    // close this modal if instructed to by the close modals event
    let sub = this.navigationService.closeModalsEvent().subscribe(t => this.modalCtrl.dismiss());
    this.subs.push(sub);

    if (!this.conditions) {
      sub = this.conditionService.getConditions().subscribe(conditions => {
        this.conditions = conditions;
      }, err => this.alertService.error(err));
      this.subs.push(sub);
    }
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  notifyChanges() {
    this.changed = true;
  }

  async onDeleteCondition(event, condition: Condition, index: number) {
    event.stopPropagation();

    const alert = await this.alertCtrl.create({
      header: `Delete ${condition.title}?`,
      message: 'Days rated by this condition will use your last used condition! Consider updating this condition rather than deleting it.',
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
            const sub = this.conditionService.deleteCondition(condition.id).subscribe(deleted => {
              this.conditions.splice(index, 1);
              this.notifyChanges();
            }, err => this.alertService.error(err));
            this.subs.push(sub);
          }
        }
      ]
    });

    await alert.present();
  }

  async onSelectCondition(condition: Condition) {
    const modal = await this.modalCtrl.create({
      component: ConditionDetailsPage,
      componentProps: {
        condition
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

  async onAddCondition() {
    const modal = await this.modalCtrl.create({
      component: ConditionDetailsPage,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(changed => {
      if (changed.data as Condition) {
        this.conditions.push(changed.data);
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
