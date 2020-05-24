import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService, AlertService, NavigationService } from '@core/services';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit, OnDestroy {
  @Input() data;

  private subs: Subscription[] = [];

  public form: FormGroup;

  public validationMessages = {
      password: [
        { type: 'required', message: 'Password is required.' },
      ],
  };
  constructor(public formBuilder: FormBuilder,
              public authService: AuthService,
              public alertService: AlertService,
              public modalCtrl: ModalController,
              public navigationService: NavigationService) { }

  ngOnInit() {
    // close this modal if instructed to by the close modals event
    const sub = this.navigationService.closeModalsEvent().subscribe(t => this.modalCtrl.dismiss());
    this.subs.push(sub);

    this.form = this.formBuilder.group({
      password: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onResetPassword() {
    const {userId, token } = this.data;
    const sub = this.authService.resetPassword({userId, token, password: this.form.value.password}).subscribe(res => {
      this.alertService.success('Password reset successfully! Please login');
      this.modalCtrl.dismiss(true);
    }, err => this.alertService.error(err));
    this.subs.push(sub);
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }
}
