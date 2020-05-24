import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Condition, Activity, Requirement } from '@data/models';
import { Subscription } from 'rxjs';
import { ConditionService, ActivityService, IconService, CacheService, SettingsService } from '@data/services';
import { ModalController } from '@ionic/angular';
import { AlertService, NavigationService } from '@core/services';
import { RequirementsPage } from '../requirements/requirements.page';

@Component({
  selector: 'app-condition-details',
  templateUrl: './condition-details.page.html',
  styleUrls: ['./condition-details.page.scss'],
})
export class ConditionDetailsPage implements OnInit, OnDestroy {
  @Input() condition: Condition;
  public conditionCopy: Condition = {grading: null};
  public activities: Activity[];
  public edit = false;
  public changed = false;
  // section for toggling requirements for each grade (great, good, meh, bad)
  public sections = [false, false, false, false];
  private subs: Subscription[] = [];

  public icons;

  public faces;

  constructor(private conditionService: ConditionService, private activityService: ActivityService,
              private modalCtrl: ModalController,
              private alertService: AlertService,
              private iconService: IconService, public navigationService: NavigationService,
              public cache: CacheService, private settingsService: SettingsService) {
                this.faces = this.settingsService.faces;
   }

  ngOnInit() {
    // close this modal if instructed to by the close modals event
    let sub = this.navigationService.closeModalsEvent().subscribe(t => this.modalCtrl.dismiss());
    this.subs.push(sub);

    if (this.condition) {
      this.edit = true;
      // make a deep copy of the condition
      this.conditionCopy = this.deepCloneCondition(this.condition);
    } else {
      this.conditionCopy = {grading: {
        bad: [],
        meh: [],
        good: [],
        great: []
      }};
      this.conditionCopy.icon = 'star';
    }
    sub = this.activityService.getActivities().subscribe(acs => {
      this.activities = acs;
      this.loadActivitiesForGrade(this.conditionCopy.grading.bad);
      this.loadActivitiesForGrade(this.conditionCopy.grading.meh);
      this.loadActivitiesForGrade(this.conditionCopy.grading.good);
      this.loadActivitiesForGrade(this.conditionCopy.grading.great);
    });
    this.subs.push(sub);
    this.icons = this.iconService.getConditionIcons();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onChanges() {
    this.changed = true;
  }

  private loadActivitiesForGrade(requirements) {
    for (const requirement of requirements) {
      for (const simpleCondition of requirement) {
        simpleCondition.activity = this.activities.find(ac => ac.id === simpleCondition.activityId);
      }
    }
  }

  async updateCondition() {
    try {
      if (this.changed) {
        const copy = this.deepCloneCondition(this.conditionCopy);
        const condition = await this.conditionService.updateCondition(this.condition.id, copy).toPromise();
        Object.assign(this.condition, condition);
        this.cache.clearCache();
        await this.closeModal(true);
      } else {
        await this.closeModal();
      }
    } catch (err) {
      this.alertService.error(err);
    }
  }

  async createCondition() {
    try {
      if (this.changed) {
        const copy = this.deepCloneCondition(this.conditionCopy);
        const condition = await this.conditionService.createCondition(copy).toPromise();
        console.log(this.conditionCopy);
        await this.closeModal(condition);
      } else {
        await this.closeModal();
      }
    } catch (err) {
      this.alertService.error(err);
    }
  }

  setIcon(icon: string) {
    this.conditionCopy.icon = icon;
    this.changed = true;
  }

  async addRequirement(event, grading) {
    event.stopPropagation();
    this.changed = true;

    const modal = await this.modalCtrl.create({
      component: RequirementsPage,
      componentProps: {
        requirement: [],
        activities: this.activities
      }
    });
    modal.onDidDismiss().then(data => {
      if (data.data) {
        grading.push(data.data);
      }
    });
    await modal.present();
  }

  removeRequirement(grading, index: number) {
    this.changed = true;
    grading.splice(index, 1);
  }

  async editRequirement(requirement: Requirement) {
    this.changed = true;
    const modal = await this.modalCtrl.create({
      component: RequirementsPage,
      componentProps: {
        requirement,
        activities: this.activities
      }
    });
    await modal.present();
  }

  toggleSection(index: number) {
    this.sections[index] = !this.sections[index];
  }

  async closeModal(data = null) {
    this.modalCtrl.dismiss(data);
  }


  private deepCloneCondition(condition: Condition): Condition {
    const copy: Condition = {grading: {great: [], good: [], meh: [], bad: []}};
    // make a shallow copy
    Object.assign(copy, condition);
    // copy requirements
    copy.grading = {
      great: this.deepCopyRequirements(condition.grading.great),
      good: this.deepCopyRequirements(condition.grading.good),
      meh: this.deepCopyRequirements(condition.grading.meh),
      bad: this.deepCopyRequirements(condition.grading.bad)
    };
    return copy;
  }

  private deepCopyRequirements(grade: Requirement[]) {
    const gradeCopy: Requirement[] = [];
    for (const requirement of grade) {
      const requirementCopy = [];
      for (const simpleCondition of requirement) {
          requirementCopy.push({activityId: simpleCondition.activityId, minValue: simpleCondition.minValue,
            maxValue: simpleCondition.maxValue});
        }
      gradeCopy.push(requirementCopy);
    }
    return gradeCopy;
  }

}
