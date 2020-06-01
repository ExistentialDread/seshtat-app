import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { StepService } from '@data/services';
import { NavigationService, AlertService } from '@core/services';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Mountain } from '@data/models';
import { MountainDetailsPage } from '../mountain-details/mountain-details.page';

@Component({
  selector: 'app-mountains',
  templateUrl: './mountains.page.html',
  styleUrls: ['./mountains.page.scss'],
})
export class MountainsPage implements OnInit, OnDestroy {
  private subs: Subscription[] = []

  @Input() mountains: Mountain[];
  private changed = 0;


  constructor(private stepService: StepService, public navigationService: NavigationService,
              private alertService: AlertService, private alertCtrl: AlertController,
              private modalCtrl: ModalController) { }

  async ngOnInit() {
    // close this modal if instructed to by the close modals event
    let sub = this.navigationService.closeModalsEvent().subscribe(t => this.modalCtrl.dismiss());
    this.subs.push(sub);
  }
  
  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  notifyChanges(code: number) {
    this.changed = code;
  }

  async onDeleteMountain(event, mountain: Mountain, index: number) {
    event.stopPropagation();

    const alert = await this.alertCtrl.create({
      header: `Delete ${mountain.name}?`,
      message: 'Warning: All steps for this mountain will be deleted! Are you sure?',
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
            try{ 
              await this.stepService.removeMountain(mountain.id);
              this.mountains.splice(index, 1);
              this.notifyChanges(this.navigationService.RETURN_CODE.DELETED);
            } catch(err) {
              this.alertService.error(err);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async onSelectMountain(mountain: Mountain) {
    const modal = await this.modalCtrl.create({
      component: MountainDetailsPage,
      componentProps: {
        mountain
      },
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(changed => {
      if (changed.data as boolean) {
        this.notifyChanges(this.navigationService.RETURN_CODE.UPDATED);
      }
    });
    await modal.present();
  }

  async onAddMountain() {
    const modal = await this.modalCtrl.create({
      component: MountainDetailsPage,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(changed => {
      if (changed.data as Mountain) {
        this.mountains.push(changed.data);
        this.notifyChanges(this.navigationService.RETURN_CODE.CREATED);
      }
    });
    await modal.present();
  }

  async closeModal() {
    this.modalCtrl.dismiss(this.changed);
  }
}
