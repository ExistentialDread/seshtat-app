import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService, NavigationService, AlertService } from '@core/services';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.page.html',
  styleUrls: ['./update-account.page.scss'],
})
export class UpdateAccountPage implements OnInit, OnDestroy {
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

  public updateForm: FormGroup;
  public user;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              public navigationService: NavigationService,
              private alertService: AlertService,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    // close this modal if instructed to by the close modals event
    let sub = this.navigationService.closeModalsEvent().subscribe(t => this.modalCtrl.dismiss());
    this.subs.push(sub);

    sub = this.authService.currentUser.subscribe(user => {
      this.user = user;
    });


    this.updateForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
      ])),
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onUpdate() {
    this.authService.updateEmail(this.updateForm.value.email).subscribe(res => {
      this.alertService.success(res.message);
      this.closeModal();
    }, err => this.alertService.error(err));

  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }
}
