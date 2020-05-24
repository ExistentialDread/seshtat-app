import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, PopoverController, AlertController } from '@ionic/angular';
import { SettingsService } from '@data/services/settings.service';
import { Subscription } from 'rxjs';
import { Settings } from '@data/models';
import { ColorPickPage } from '../color-pick/color-pick.page';
import { NavigationService, AuthService, AlertService } from '@core/services';
import { UpdateAccountPage } from '../user/update-account/update-account.page';
import { CacheService } from '@data/services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  public settings: Settings;
  public changed = false;

  public faces;

  constructor(private modalCtrl: ModalController,
              public navigationService: NavigationService,
              private alertCtrl: AlertController,
              private settingsService: SettingsService,
              private authService: AuthService,
              private alertService: AlertService,
              private cache: CacheService,
              private popoverCtrl: PopoverController) {
               }


  ngOnInit() {
    // close this modal if instructed to by the close modals event
    let sub = this.navigationService.closeModalsEvent().subscribe(t => this.modalCtrl.dismiss());
    this.subs.push(sub);

    this.faces = this.settingsService.faces;

    sub = this.settingsService.CurrentSettings.subscribe(settings => {
      if (!settings) { return; }
      this.settings = JSON.parse(JSON.stringify(settings)); // deep clone the settings
      this.initializeMissingProperties();
    });
    this.subs.push(sub);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onChanges() {
    this.changed = true;
  }

  async applyChanges() {
    if (this.changed) {
      const addons = this.settings.addons;
      if (addons.existentialDread.enabled && addons.ageTimer.enabled && !addons.ageTimer.birthday) {
        const alert = await this.alertCtrl.create({
          header: 'No Birthday!',
          message: 'You have activated the Age Timer without setting you birthdate. Please set your birthdate',
          buttons: [
            {
              text: 'Ok mom!',
            }
          ]
        });
        await alert.present();
      } else {
        await this.settingsService.update(this.settings);
        this.modalCtrl.dismiss(this.changed);
      }
    } else {
      this.modalCtrl.dismiss(this.changed);
    }
  }

  async openColorPick(ev: any, grade: number) {
    const popover = await this.popoverCtrl.create({
      component: ColorPickPage,
      event: ev,
      translucent: true,

    });
    popover.onDidDismiss().then(res => {
      if (!res.data) { return; }
      this.changed = true;
      const color = res.data;
      switch (grade) {
        case 0: {
          this.settings.grading.great.color = color;
          document.documentElement.style.setProperty('--sesh-great-color', color);
          break;
        }
        case 1: {
          this.settings.grading.good.color = color;
          document.documentElement.style.setProperty('--sesh-good-color', color);
          break;
        }
        case 2: {
          this.settings.grading.meh.color = color;
          document.documentElement.style.setProperty('--sesh-meh-color', color);
          break;
        }
        case 3: {
          this.settings.grading.bad.color = color;
          document.documentElement.style.setProperty('--sesh-bad-color', color);
          break;
        }
        case 4: {
          this.settings.grading.awful.color = color;
          document.documentElement.style.setProperty('--sesh-awful-color', color);
          break;
        }
      }
    });
    await popover.present();
  }

  async resetSettings() {
    const alert = await this.alertCtrl.create({
      header: 'Reset Settings?',
      message: 'Are you sure you want to reset your Settings?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Reset',
          handler: async () => {
            await this.settingsService.reset().toPromise();
          }
        }
      ]
    });
    await alert.present();
  }

  async updateEmail() {
    const modal = await this.modalCtrl.create({
      component: UpdateAccountPage,
    });
    await modal.present();
  }

  async resetAccount() {
    const alert = await this.alertCtrl.create({
      header: 'Reset All Days Data?',
      message: 'All recorded activities and rating for days will be removed!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Confirm',
          handler: async () => {
            try {
              const { message } = await this.authService.resetAccount().toPromise();
              this.alertService.success(message);
              this.cache.clearCache();
            } catch (ex) {
              this.alertService.error(ex);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteAccount() {
    const alert = await this.alertCtrl.create({
      header: 'Reset All Days Data?',
      message: 'Are you sure you want to delete your Account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Confirm',
          handler: async () => {
            try {
              const { message } = await this.authService.deleteAccount().toPromise();
              this.alertService.success(message);
              await this.authService.logout();
              this.navigationService.goTo('/home');
            } catch (ex) {
              this.alertService.error(ex);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async closeModal() {
    if (!this.changed) {
      this.modalCtrl.dismiss(this.changed);
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
            // make sure the colors are reset
            this.settingsService.applyColors();
            this.modalCtrl.dismiss(false);
            // make sure the theme is reset
            this.settingsService.applyTheme();
          }
        }, {
          text: 'Save',
          handler: async () => {
            await this.applyChanges();
          }
        }
      ]
    });
    await alert.present();
  }

  flipIcons() {
    const { existentialDread } = this.settings.addons;
    // make sure we dont affect the settings service faces;
    this.faces = JSON.parse(JSON.stringify(this.faces));
    if (existentialDread.enabled && existentialDread.flipIcons) {
      this.faces.great = 'assets/great2.svg';
      this.faces.good = 'assets/good2.svg';
      this.faces.meh = 'assets/meh2.svg';
      this.faces.bad = 'assets/bad2.svg';
      this.faces.awful = 'assets/awful2.svg';
    } else {
      this.faces.awful = 'assets/awful.svg';
      this.faces.bad = 'assets/bad.svg';
      this.faces.meh = 'assets/meh.svg';
      this.faces.good = 'assets/good.svg';
      this.faces.great = 'assets/great.svg';
    }
  }

  changeTheme() {
    document.body.classList.toggle('dark', this.settings.darkMode);
  }

  private initializeMissingProperties() {
    if (this.settings.darkMode === undefined) {
      this.settings.darkMode = false;
    }
  }
}
