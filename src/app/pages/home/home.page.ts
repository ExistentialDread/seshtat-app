import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, NavigationService } from '@core/services';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { SignupModal, SigninModal } from 'src/app/modals/user';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordPage } from 'src/app/modals/user/reset-password/reset-password.page';
import { SettingsService } from '@data/services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public user;
  private subs: Subscription[] = [];
  public faces;

  constructor(private authService: AuthService,
              public navigationService: NavigationService,
              public settingsService: SettingsService,
              private modalCtrl: ModalController,
              private route: ActivatedRoute) {}

  ngOnInit() {
    // Get the user if logged in
    let sub = this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
    this.subs.push(sub);

    // Get the settings
    sub = this.settingsService.CurrentSettings.subscribe(settings => {
      this.faces = this.settingsService.faces;
    });
    this.subs.push(sub);

    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      const token = params.get('token');
      if (userId && token) {
        this.modalCtrl.create({
          component: ResetPasswordPage,
          componentProps: {
            data: { userId, token }
          },
        }).then(async modal => {
          modal.onDidDismiss().then(data => {
            if (data.data) {
              this.openLogin();
            }
          });
          await modal.present();
        });
      }
    });
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
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
}
