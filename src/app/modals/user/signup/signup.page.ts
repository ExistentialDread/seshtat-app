import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService, AlertService, NavigationService } from '@core/services';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  public validationMessages = {
      username: [
        { type: 'required', message: 'Username is required.' },
        { type: 'minlength', message: 'Username must be at least 5 characters long.' },
        { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
        { type: 'pattern', message: 'Your username must contain only letters and numbers.' },
        { type: 'validUsername', message: 'Your username has already been taken.' }
      ],
      email: [
        { type: 'required', message: 'Email is required.' },
        { type: 'pattern', message: 'Please enter a valid email.' }
      ],
      password: [
        { type: 'required', message: 'Password is required.' },
        { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      ],
      terms: [
        { type: 'pattern', message: 'You must accept terms and conditions.' }
      ],
  };

  public registerForm: FormGroup;

  constructor(public formBuilder: FormBuilder,
              public authService: AuthService,
              public alertService: AlertService,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public navigationService: NavigationService) { }

  ngOnInit() {
    // close this modal if instructed to by the close modals event
    const sub = this.navigationService.closeModalsEvent().subscribe(t => this.modalCtrl.dismiss());
    this.subs.push(sub);

    this.registerForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        // UsernameValidator.validUsername,
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9]+$'),
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      terms: new FormControl(false, Validators.pattern('true'))
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onSignup() {
    this.authService.register(this.registerForm.value).subscribe(res => {
      this.alertService.success('Successfully Registered!');
      this.navigationService.goTo('/calendar');
    }, err => this.alertService.error(err));

  }

  goToSignin() {
    this.modalCtrl.dismiss(true);
  }

  async termsAndConditions() {
    const alert = await this.alertCtrl.create({
      header: 'Terms and Conditions',
      message: `Seshtat is an app I made for friends and family.
      It does not contain adds or sell your data.
      It needs minimal cookies to ensure you don't have to login everytime.`,
      buttons: ['Ok']
    });
    await alert.present();
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }
}
