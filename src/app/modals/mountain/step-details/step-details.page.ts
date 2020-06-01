import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Step, Action, Mountain, Path } from '@data/models';
import { ModalController } from '@ionic/angular';
import { AlertService, NavigationService } from '@core/services';
import { StepService, IconService } from '@data/services';

@Component({
  selector: 'app-step-details',
  templateUrl: './step-details.page.html',
  styleUrls: ['./step-details.page.scss'],
})
export class StepDetailsPage implements OnInit, OnDestroy {
  subs: Subscription[] = [];

  @Input() step: Step;
  @Input() mountains: Mountain[];

  public stepCopy: Partial<Step> = {};
  public edit = false;
  public changed = 0;

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

    if(this.step) {
      this.edit = true;
      this.stepCopy = this.deepCopy(this.step);
    } else {
      this.stepCopy = {
        icon: 'hermes',
        status: 'LOCKED',
        mountainId: this.mountains[0].id,
        actions: [],
        paths: [],
        row: 0,
        col: 0
      }
    }

    // Get list of icons
    this.icons = this.iconService.getMountainIcons();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onChanges(code: number = this.navigationService.RETURN_CODE.CREATED) {
    this.changed = code;
  }

  deepCopy(step: Step): Step {
    const clone: Partial<Step> = {};
    // shallow copy
    Object.assign(clone, step);
    // copy actions
    clone.actions = [];
    for(let action of step.actions) {
      const ac: Partial<Action> = {};
      Object.assign(ac, action);
      clone.actions.push(ac as Action);
    }
    // copy paths
    clone.paths = [];
    for(let path of step.paths) {
      const p: Path[] = [];
      for(let subpath of path) {
        const sp: Partial<Path> = {};
        Object.assign(sp, subpath);
        p.push(sp as Path);
      }
      clone.paths.push(p);
    }
    return clone as Step;
  }

  async updateStep() {
    try {
      // if (this.changed) {
        const copy = this.deepCopy(this.stepCopy as Step);
        const step = await this.stepService.updateStep(this.step.id, copy);
        Object.assign(this.step, step);
        await this.closeModal(this.navigationService.RETURN_CODE.UPDATED);
      // } else {
      //   await this.closeModal();
      // }
    } catch (err) {
      this.alertService.error(err);
    }
  }

  async createStep() {
    try {
      // if (this.changed) {
        const copy = this.deepCopy(this.stepCopy as Step);
        const step = await this.stepService.addStep(copy as Step);
        step.actions = JSON.parse(step.actions as any);
        step.paths = JSON.parse(step.paths as any);
        await this.closeModal(step);
      // } else {
      //   await this.closeModal(this.navigationService.RETURN_CODE.NO_CHANGE);
      // }
    } catch (err) {
      this.alertService.error(err);
    }
  }

  async createOrUpdateStep() {
    if(this.edit) {
      await this.updateStep();
    } else {
      await this.createStep();
    }
  }

  setIcon(icon: string) {
    this.stepCopy.icon = icon;
    this.onChanges();
  }

  async closeModal(data = null) {
    this.modalCtrl.dismiss(data);
  }

  addAction() {
    if(!this.stepCopy.actions) this.stepCopy.actions = [];
    this.stepCopy.actions.push({ title: '', done: false});
    this.onChanges();
  }

  removeAction(index: number) {
    this.stepCopy.actions.splice(index);
    this.onChanges();
  }

  addPath() {
    if(!this.stepCopy.paths) this.stepCopy.paths = [];
    this.stepCopy.paths.push([{row: 0, col: 0}]);
    this.onChanges();
  }

  removePath(index: number) {
    this.stepCopy.paths.splice(index);
    this.onChanges();
  }

  addSubpath(path: Path[]) {
    path.push({row: 0, col: 0});
    this.onChanges();
  }

  removeSubpath(path: Path[], index: number) {
    path.splice(index);
    this.onChanges();
  }
}
