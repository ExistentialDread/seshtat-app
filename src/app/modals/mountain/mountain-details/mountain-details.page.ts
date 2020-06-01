import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService, NavigationService } from '@core/services';
import { Subscription } from 'rxjs';
import { Mountain } from '@data/models';
import { StepService, IconService } from '@data/services';

@Component({
  selector: 'app-mountain-details',
  templateUrl: './mountain-details.page.html',
  styleUrls: ['./mountain-details.page.scss'],
})
export class MountainDetailsPage implements OnInit, OnDestroy {
  subs: Subscription[] = [];

  @Input() mountain: Mountain;
  public mountainCopy: Partial<Mountain> = {};
  public edit = false;
  public changed = false;

  public icons;

  constructor(private modalCtrl: ModalController,
              private alertService: AlertService,
              private stepService: StepService,
              private iconService: IconService,
              public navigationService: NavigationService,) { }

  ngOnInit() {
    // close this modal if instructed to by the close modals event
    const sub = this.navigationService.closeModalsEvent().subscribe(t => this.modalCtrl.dismiss());
    this.subs.push(sub);

    if(this.mountain) {
      this.edit = true;
      Object.assign(this.mountainCopy, this.mountain);
      delete this.mountainCopy.selected;
    } else {
      this.mountainCopy = {
        icon: 'hermes'
      }
    }

    // Get list of icons
    this.icons = this.iconService.getMountainIcons();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onChanges() {
    this.changed = true;
  }

  async updateMountain() {
    try {
      if (this.changed) {
        const mountain = await this.stepService.updateMountain(this.mountain.id, this.mountainCopy);
        Object.assign(this.mountain, mountain);
        await this.closeModal(true);
      } else {
        await this.closeModal();
      }
    } catch (err) {
      this.alertService.error(err);
    }
  }

  async createMountain() {
    try {
      if (this.changed) {
        const mountain = await this.stepService.addMountain(this.mountainCopy as Mountain);
        await this.closeModal(mountain);
      } else {
        await this.closeModal();
      }
    } catch (err) {
      this.alertService.error(err);
    }
  }

  setIcon(icon: string) {
    this.mountainCopy.icon = icon;
    this.changed = true;
  }

  async closeModal(data = null) {
    this.modalCtrl.dismiss(data);
  }
}
