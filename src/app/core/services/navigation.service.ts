import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private closeModalsSubject = new Subject<boolean>();

  public RETURN_CODE = {
    NO_CHANGE: 0,
    DELETED: 1,
    UPDATED: 2,
    CREATED: 3
  }

  constructor(private navCtrl: NavController,
              private menuCtrl: MenuController) { }

  public closeModalsEvent(): Observable<boolean> {
    return this.closeModalsSubject.asObservable();
  }

  async closeModals() {
    this.closeModalsSubject.next(true);
  }

  async goTo(url: string) {
    await this.menuCtrl.close();
    this.closeModals();
    this.navCtrl.navigateBack([url]);
  }
}
