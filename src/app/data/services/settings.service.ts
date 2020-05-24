import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from '@core/services';
import { Settings } from '@data/models/settings';

import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private currentSettingsSubject = new BehaviorSubject<Settings>(null);
  private apiRoot = 'settings';

  public faces = {
    great: 'assets/great.svg',
    good: 'assets/good.svg',
    meh: 'assets/meh.svg',
    bad: 'assets/bad.svg',
    awful: 'assets/awful.svg',
  };

  public colors = {
    great: '#518802', good: '#519c6f', meh: '#5c6a6f', bad: '#e87219', awful: '#cd6a6f'
  };


  constructor(private api: ApiService, private storage: Storage) {
  }

  load(): Observable<Settings> {
    return this.api.get<Settings>(`${this.apiRoot}`).pipe(tap(async (settings: Settings) => {
      await this.updateLocalSettings(settings);
    }));
  }

  async update(settings: Settings): Promise<Settings> {
    await this.updateLocalSettings(settings);
    return this.api.patch<Settings>(`${this.apiRoot}`, settings).toPromise();
  }

  reset(): Observable<Settings> {
    return this.api.get<Settings>(`${this.apiRoot}/reset`).pipe(tap(async (res: Settings) => {
      await this.updateLocalSettings(res);
    }));
  }

  applyColors() {
    const settings = this.currentSettingsSubject.value;
    document.documentElement.style.setProperty('--sesh-great-color', settings.grading.great.color);
    document.documentElement.style.setProperty('--sesh-good-color', settings.grading.good.color);
    document.documentElement.style.setProperty('--sesh-meh-color', settings.grading.meh.color);
    document.documentElement.style.setProperty('--sesh-bad-color', settings.grading.bad.color);
    document.documentElement.style.setProperty('--sesh-awful-color', settings.grading.awful.color);
  }

  updateColors(settings: Settings) {
    this.colors.great = settings.grading.great.color;
    this.colors.good = settings.grading.good.color;
    this.colors.meh = settings.grading.meh.color;
    this.colors.bad = settings.grading.bad.color;
    this.colors.awful = settings.grading.awful.color;
  }

  flipIcons(settings: Settings) {
    const { existentialDread } = settings.addons;
    if (existentialDread.enabled && existentialDread.flipIcons) {
      this.faces.great = 'assets/great2.svg';
      this.faces.good = 'assets/good2.svg';
      this.faces.bad = 'assets/bad2.svg';
      this.faces.meh = 'assets/meh2.svg';
      this.faces.awful = 'assets/awful2.svg';
    } else {
      this.faces.great = 'assets/great.svg';
      this.faces.good = 'assets/good.svg';
      this.faces.bad = 'assets/bad.svg';
      this.faces.meh = 'assets/meh.svg';
      this.faces.awful = 'assets/awful.svg';
    }
  }

  public get CurrentSettings() {
    return this.currentSettingsSubject;
  }

  private async updateLocalSettings(settings: Settings) {
    this.updateColors(settings);
    this.currentSettingsSubject.next(settings);
    await this.storage.set('SETTINGS', settings);
    this.flipIcons(settings);
  }

  public applyTheme() {
    document.body.classList.toggle('dark', this.CurrentSettings.value.darkMode);
  }
}

