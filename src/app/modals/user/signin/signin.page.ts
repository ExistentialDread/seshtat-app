import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService, AlertService, NavigationService } from '@core/services';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  public forgotPassword = false;

  public validationMessages = {
      username: [
        { type: 'required', message: 'Username or Email are required.' },
      ],
      email: [
        { type: 'required', message: 'Email is required.' },
        { type: 'pattern', message: 'Please enter a valid email.' }
      ],
      password: [
        { type: 'required', message: 'Password is required.' },
      ],
  };

  public loginForm: FormGroup;
  public forgotPasswordForm: FormGroup;

  constructor(public formBuilder: FormBuilder,
              public authService: AuthService,
              public alertService: AlertService,
              public modalCtrl: ModalController,
              public navigationService: NavigationService) { }

  ngOnInit() {
    // close this modal if instructed to by the close modals event
    const sub = this.navigationService.closeModalsEvent().subscribe(async e => await this.closeModal());
    this.subs.push(sub);

    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });

    this.forgotPasswordForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
      ])),
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  async onSignin() {
    try {
      await this.authService.login(this.loginForm.value).toPromise();
      this.alertService.success('Successfully logged in!');
      this.closeModal();
      this.navigationService.goTo('/calendar');
    } catch (err) {
      this.alertService.error(err);
    }
  }

  onForgotPassword(forgot = true) {
    this.forgotPassword = forgot;
  }

  async onSendPasswordResetEmail() {
    try {
      await this.authService.forgotPassword(this.forgotPasswordForm.value).toPromise();
      this.alertService.success('An email has been sent to your email address!');
      this.closeModal();
    } catch (err) {
      this.alertService.error(err);
    }
  }

  goToSignup() {
    // 'true' indicates that we want to move to Signup
    this.modalCtrl.dismiss(true);
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }
}
