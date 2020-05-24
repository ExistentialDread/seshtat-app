import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Requirement, Activity } from '@data/models';
import { ModalController } from '@ionic/angular';
import { NavigationService } from '@core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.page.html',
  styleUrls: ['./requirements.page.scss'],
})
export class RequirementsPage implements OnInit, OnDestroy {
  @Input() requirement: Requirement;
  @Input() activities: Activity[];
  public checked: boolean[] = [];

  public subs: Subscription[] = [];

  constructor(private modalCtrl: ModalController, public navigationService: NavigationService) { }

  ngOnInit() {
    // close this modal if instructed to by the close modals event
    const sub = this.navigationService.closeModalsEvent().subscribe(t => this.modalCtrl.dismiss());
    this.subs.push(sub);

    for (let i = 0; i < this.activities.length; i++) {
      if (this.requirement.find(simpleCondition => simpleCondition.activityId === this.activities[i].id)) {
        this.checked[i] = true;
      } else {
        this.checked[i] = false;
      }
    }
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  async closeModal(commit = false) {
    if (commit) {
      for (let i = 0; i < this.checked.length; i++) {
        const simpleCondition = this.requirement.find(sc => sc.activityId === this.activities[i].id);
        if (this.checked[i]) {
          if (!simpleCondition) {
            // simple condition needs to be added
            this.requirement.push({activityId: this.activities[i].id, activity: this.activities[i]});
          }
        } else {
          if (simpleCondition) {
            // simple condition needs to be removed
            const index = this.requirement.indexOf(simpleCondition);
            this.requirement.splice(index, 1);
          }
        }
      }
      this.modalCtrl.dismiss(this.requirement);

    } else {
      this.modalCtrl.dismiss();
    }
  }

}
