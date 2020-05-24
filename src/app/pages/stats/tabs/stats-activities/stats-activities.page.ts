import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Activity, Record } from '@data/models';
import { AlertService, NavigationService } from '@core/services';
import { RecordService, ActivityService, DayService } from '@data/services';
import * as moment from 'moment';

@Component({
  selector: 'app-stats-activities',
  templateUrl: './stats-activities.page.html',
  styleUrls: ['./stats-activities.page.scss'],
})
export class StatsActivitiesPage implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  public mode = 'm';

  public current: string;
  private currentDate: moment.Moment;

  public activities: Activity[];

  public activitiesMap = {};

  public activitiesLine = {
    options: null
  };

  public firstLast: {first: string, last: string};

  constructor(private alertService: AlertService, public navigationService: NavigationService,
              private recordService: RecordService, public activitiesService: ActivityService, public dayService: DayService) { }

  ngOnInit() {
    this.currentDate = moment.utc();
  }

  ionViewDidEnter() {
    const sub = this.activitiesService.getActivities().subscribe(async data => {
      if(data.length === 0) {
        this.activities = null;
        return;
      }
      this.activities = data;
      this.activities.forEach(ac => ac.selected = false);

      this.firstLast = await this.dayService.getFirstLast().toPromise();

      await this.toggleActivity(false, this.activities[0]);

    }, err => this.alertService.error(err));
    this.subs.push(sub);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  async segmentChanged() {
    await this.createViewGivenMode();
  }

  createViewGivenMode() {
    switch (this.mode) {
      case 'm': this.createPerMonthView(); break;
      case 'w': this.createLast4WeeksView(); break;
      default: this.createAllView();
    }
  }

  createPerMonthView() {
    this.current = this.currentDate.format('MMMM YYYY');
    const start = this.currentDate.clone().startOf('month');
    const end = this.currentDate.clone().endOf('month');
    this.createActivitiesLineChart(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
  }

  createLast4WeeksView() {
    const end = moment();
    const start = end.clone().subtract('4', 'w');
    this.createActivitiesLineChart(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
  }

  createAllView() {
    this.createActivitiesLineChart(null, null);
  }

  createActivitiesLineChart(min: string, max: string) {
    const series = [];
    const yAxis = [];
    let index = 0;
    this.activities.forEach(ac => {
      if(ac.selected) {
        const infos = this.activitiesMap[ac.id];
        const serie = {
          name: ac.title,
          type: 'line',
          smooth: true,
          data: infos.dataset,
          yAxisIndex: index,
        };
        series.push(serie);
        // yAxis
        const yAxi = {
          type: 'value',
          name: ac.title,
          min: infos.min,
          max: infos.max
        }
        yAxis.push(yAxi);
        index++;
      }
    });

    this.activitiesLine.options = {
      title: {
        text: 'Activities Records',
        left: 'center',
        top: 'top',
        padding: 15
      },
      xAxis: {
        type: 'time',
        splitLine: { show: false },
      },
      yAxis,
      grid: [
        { bottom: 80 }, { bottom: 80 }
      ],
      dataZoom: [
        {
          type: 'inside',
          filterMode: 'none',
          startValue: min,
          endValue: max
        },
        {}
      ],
      series,
    };
  }

  async toggleActivity(currentlySelected: boolean, activity: Activity) {
    if(!currentlySelected) {
      await this.loadActivity(activity);
    } else {
      this.unloadActivity(activity);
    }
    await this.createViewGivenMode();
  }

  unloadActivity(activity: Activity) {
    activity.selected = false;
  }

  async loadActivity(activity: Activity) {
    // load the data if needed
    if(!this.activitiesMap[activity.id]){
      const data = await this.recordService.getActivityRecords(activity.id).toPromise();
      this.activitiesMap[activity.id] = this.populateNullDataWithDefaultValue(activity, data);
    }
    activity.selected = true;
  }

  enumerateDaysBetween(first: string, last: string): string[] {
    const start = moment.utc(first);
    const end = moment.utc(last);
    const days = [start.format('YYYY-MM-DD')];
    while (start.add(1, 'days').diff(end) < 0) {
      days.push(start.format('YYYY-MM-DD'));
    }
    return days;
  }

  populateNullDataWithDefaultValue(activity, data: Record[]): {min: number, max: number, dataset } {
    const dataset = [];
    let min = Infinity;
    let max = -Infinity;
    let containsEmptyDays = false;
    const start = moment.utc(this.firstLast.first);
    data.forEach(rec => {
      const current = moment.utc(rec.date);
      const diff = current.diff(start, 'days');

      if(diff > 0) containsEmptyDays = true;

      for(let i = 1; i <= diff; i++) {
        dataset.push([start.format('YYYY-MM-DD'), activity.default]);
        start.add(1, 'day');
      }
      const value = (rec.value == null) ? 1 : Number(rec.value);
      if(value <= min) min = value;
      if(value >= max) max = value;
      dataset.push([rec.date, value ]);
      start.add(1, 'day');
    });

    if(containsEmptyDays) min = 0;

    const end = moment.utc(this.firstLast.last);
    //fill the remaining days
    const diff = end.diff(start, 'days');
    for(let i = 1; i <= diff; i++) {
      dataset.push([start.format('YYYY-MM-DD'), activity.default]);
      start.add(1, 'day');
    }
    return { min, max, dataset };
  }

  getPrevious() {
    switch (this.mode) {
      case 'm': this.currentDate.subtract(1, 'M'); break;
    }
    this.createViewGivenMode();
  }

  getNext() {
    switch (this.mode) {
      case 'm': this.currentDate.add(1, 'M'); break;
    }
    this.createViewGivenMode();
  }

}
