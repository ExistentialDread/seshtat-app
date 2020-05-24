import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { AlertService, NavigationService } from '@core/services';
import { DayService, SettingsService } from '@data/services';
import { Day, Settings } from '@data/models';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-stats-overall',
  templateUrl: './stats-overall.page.html',
  styleUrls: ['./stats-overall.page.scss'],
})
export class StatsOverallPage implements OnInit, OnDestroy {
  @ViewChild('gradeChart', {static: false}) gradeChart;
  @ViewChild('weekGradeChart', {static: false}) weekGradeChart;

  private subs: Subscription[] = [];

  public data: Day[];
  public formattedData: [string, number][];

  public mode = 'm';

  public grading;
  public settings: Settings;

  public weekDays = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
  public firstDayOfWeek = 0;

  public weekdayRatingBars = {
    options: null,
    update: null
  };

  public ratingLine = {
    options: null,
    update: null
  };

  public overallPie = {
    options: null,
    update: null
  };

  public average: {rating: string, icon: string };

  public current: string;

  private currentDate: moment.Moment;



  constructor(private alertService: AlertService, public navigationService: NavigationService,
              private dayService: DayService, private settingsService: SettingsService) { }

  ngOnInit() {
    this.currentDate = moment.utc();
    const sub = this.settingsService.CurrentSettings.subscribe(async (settings) => {
      if (settings) {
        this.settings = settings;
        // Get data
        this.data = await this.dayService.getAll().toPromise();
        this.data.forEach(day => {
          day.date = moment(day.date);
        });

        this.formattedData = this.data.map(d => { return [d.date.format('YYYY-MM-DD'), this.ratingToNumber(d.rating)]; });

        // Check first day of the week
        const firstDay = settings.firstDayOfWeek;
        this.firstDayOfWeek = +firstDay;
        const weekDays = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
        for (let i = 0; i < 7; i++) {
          this.weekDays[i] = weekDays[(i + this.firstDayOfWeek) % 7];
        }
        // Add grading to get the colors and names for the grades
        this.grading = settings.grading;
        this.createViewGivenMode();
      }
    }, err => this.alertService.error(err));

    this.subs.push(sub);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }


  segmentChanged() {
    this.createViewGivenMode();
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
    const data = this.data.filter(day => day.date.isBetween(start, end, null, '[]'));
    this.createOverallPieChart(this.getNbrOfDaysPerGrade(data));
    this.createWeekdayChart(this.getNbrOfDaysPerGradePerWeekDay(data));
    this.createRatingChart(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
  }

  createLast4WeeksView() {
    const end = moment();
    const start = end.clone().subtract('4', 'w');
    const data = this.data.filter(day => day.date.isBetween(start, end, null, '[]'));
    this.createOverallPieChart(this.getNbrOfDaysPerGrade(data));
    this.createWeekdayChart(this.getNbrOfDaysPerGradePerWeekDay(data));
    this.createRatingChart(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
  }

  createAllView() {
    this.createOverallPieChart(this.getNbrOfDaysPerGrade(this.data));
    this.createWeekdayChart(this.getNbrOfDaysPerGradePerWeekDay(this.data));
    this.createRatingChart(null, null);
  }

  createOverallPieChart(data) {
    const rating = this.getAverageRating(data);
    if (rating == null) {
      this.average = null;
    } else {
      this.average = {
        rating,
        icon: this.settingsService.faces[rating]
      };
    }

    this.overallPie.options = {
      title: {
        text: 'Overall rating of days',
        left: 'center',
        top: 'top',
        padding: 15
      },
      legend: {
        show: true,
        bottom: '10',
        data: [this.grading.great.text, this.grading.good.text,
              this.grading.meh.text, this.grading.bad.text,
              this.grading.awful.text, 'unrated']
      },
      series: [
        {
          name: 'pie',
          type: 'pie',
          radius: ['45%', '75%'],
          data, 
          color: [this.grading.great.color, this.grading.good.color,
                this.grading.meh.color, this.grading.bad.color,
                this.grading.awful.color, '#E3E3E3'],
          label: {
            show: false,
          }
        }
      ]
    }
  }

  createWeekdayChart(data) {
    this.weekdayRatingBars.options = {
      title: {
        text: 'Rating of days per week day',
        left: 'center',
        top: 'top',
        padding: 15
      },
      legend: {
        show: true,
        bottom: '10'
      },
      xAxis: {
        data: this.weekDays,
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
      },
      grid: [
        { bottom: 80 }, { bottom: 80 }
      ],
      series: [
        {
          name: this.grading.great.text,
          color: this.grading.great.color,
          type: 'bar',
          stack: 'one',
          data: data.great,
        },
        {
          name: this.grading.good.text,
          color: this.grading.good.color,
          type: 'bar',
          stack: 'one',
          data: data.good,
        },
        {
          name: this.grading.meh.text,
          color: this.grading.meh.color,
          type: 'bar',
          stack: 'one',
          data: data.meh,
        },
        {
          name: this.grading.bad.text,
          color: this.grading.bad.color,
          type: 'bar',
          stack: 'one',
          data: data.bad,
        },
        {
          name: this.grading.awful.text,
          color: this.grading.awful.color,
          type: 'bar',
          stack: 'one',
          data: data.awful,
        },
        {
          name: 'unrated',
          color: 'rgba(220,220,220, 0.8)',
          type: 'bar',
          stack: 'one',
          data: data.ukw,
        }
      ]
    }

  }

  createRatingChart(min: string, max: string) {
    this.ratingLine.options = {
      title: {
        text: 'Rating of days',
        left: 'center',
        top: 'top',
        padding: 15
      },
      xAxis: {
        type: 'time',
        splitLine: { show: false },
      },
      yAxis: {
        show: false,
        type: 'value',
        min: 0,
        max: 6
      },
      grid: [
        { bottom: 80, left: 40, right: 10 }, { bottom: 80 }
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
      visualMap: {
        show: false,
        dimension: 1,
        pieces: [{
          gte: 1,
          lt: 1.5,
          color: this.settings.grading.awful.color,
        }, {
          gte: 1.5,
          lt: 2.5,
          color: this.settings.grading.bad.color,
        }, {
          gte: 2.5,
          lt: 3.5,
          color: this.settings.grading.meh.color,
        }, {
          gte: 3.5,
          lt: 4.5,
          color: this.settings.grading.good.color,
        }, {
          gte: 4.5,
          lte: 5,
          color: this.settings.grading.great.color,
        }]
      },
      series: [{
        name: 'great',
        type: 'line',
        smooth: true,
        connectNulls: true,
        data: this.formattedData,
        markArea: {
          silent: true,
          label: { position: 'left', color: this.settings.grading.great.color },
          itemStyle: { color: this.settings.grading.great.color + '15' /*'rgba(71, 122, 0, 0.1)'*/ },
          data: [
            [{ name: this.settings.grading.great.text, yAxis: 4.5 }, { yAxis: 5.5 }]
          ]
        }
      }, {
        name: 'good',
        type: 'line',
        markArea: {
          silent: true,
          label: { position: 'left', color: this.settings.grading.good.color },
          itemStyle: { color: this.settings.grading.good.color + '15' /*'rgba(71, 122, 0, 0.1)'*/ },
          data: [
            [{ name: this.grading.good.text, yAxis: 3.5 }, { yAxis: 4.5 }]
          ]
        }
      }, {
        name: 'meh',
        type: 'line',
        markArea: {
          silent: true,
          label: { position: 'left', color: this.settings.grading.meh.color },
          itemStyle: { color: this.settings.grading.meh.color + '15' /*'rgba(71, 122, 0, 0.1)'*/ },
          data: [
            [{ name: this.grading.meh.text, yAxis: 2.5 }, { yAxis: 3.5 }]
          ]
        }
      }, {
        name: 'bad',
        type: 'line',
        markArea: {
          silent: true,
          label: { position: 'left', color: this.settings.grading.bad.color },
          itemStyle: { color: this.settings.grading.bad.color + '15' /*'rgba(71, 122, 0, 0.1)'*/ },
          data: [
            [{ name: this.grading.bad.text, yAxis: 1.5 }, { yAxis: 2.5 }]
          ]
        }
      }, {
        name: 'awful',
        type: 'line',
        markArea: {
          silent: true,
          label: { position: 'left', color: this.settings.grading.awful.color },
          itemStyle: { color: this.settings.grading.awful.color + '15' /*'rgba(71, 122, 0, 0.1)'*/ },
          data: [
            [{ name: this.grading.awful.text, yAxis: 0.5 }, { yAxis: 1.5 }]
          ]
        }
      },
      ]
    }
  }

  private ratingToNumber(rating: string): number {
    if(!rating) return null;
    switch(rating) {
      case 'great': return 5;
      case 'good': return 4;
      case 'meh': return 3;
      case 'bad': return 2;
      case 'awful': return 1;
    }
  }

  private getNbrOfDaysPerGrade(days: Day[]): {value: number, name: string}[] {
    let greats = 0, goods = 0, mehs = 0, bads = 0, awfuls = 0, ukws = 0;
    days.forEach(day => {
      if (!day.rating) { ukws++; } else {
        switch (day.rating) {
          case 'great': greats++; break;
          case 'good': goods++; break;
          case 'meh': mehs++; break;
          case 'bad': bads++; break;
          case 'awful': awfuls++; break;
          default: ukws++;
        }
      }
    });

    return [{ value: greats, name: this.grading.great.text }, { value: goods, name: this.grading.good.text },
      { value: mehs, name: this.grading.meh.text }, { value: bads, name: this.grading.bad.text },
      { value: awfuls, name: this.grading.awful.text }, { value: ukws, name: 'unrated' }];
  }

  private getAverageRating(ratings: {value: number, name: string}[]): string | null {
    console.log(ratings);
    const total = ((3 * ratings[0].value) + (1.5 * ratings[1].value) + (0 * ratings[2].value) + (-1 * ratings[3].value) + (-2 * ratings[4].value));
    const sum = ratings[0].value + ratings[1].value + ratings[2].value + ratings[3].value + ratings[4].value;
    if (sum <= 0) { return null; }

    let average = (total * 1.0) / sum;
    average = Math.round(average);
    return (average >= 2) ? 'great' : (average >= 1) ? 'good' : (average >= 0) ? 'meh' : (average >= -1) ? 'bad' : 'awful';
  }

  private getNbrOfDaysPerGradePerWeekDay(days: Day[]): {great: number[],
    good: number[], meh: number[], bad: number[], awful: number[], ukw: number[]} {

    const great = [0, 0, 0, 0, 0, 0, 0],
    good = [0, 0, 0, 0, 0, 0, 0],
    meh = [0, 0, 0, 0, 0, 0, 0],
    bad = [0, 0, 0, 0, 0, 0, 0],
    awful = [0, 0, 0, 0, 0, 0, 0],
    ukw = [0, 0, 0, 0, 0, 0, 0];
    days.forEach(day => {
      const date = (day.date.day() + this.firstDayOfWeek) % 7;
      if (!day.rating) { ukw[date] = ukw[date] + 1; } else {
        switch (day.rating) {
          case 'great': great[date] = great[date] + 1; break;
          case 'good': good[date] = good[date] + 1; break;
          case 'meh': meh[date] = meh[date] + 1; break;
          case 'bad': bad[date] = bad[date] + 1; break;
          case 'awful': awful[date] = awful[date] + 1; break;
          default: ukw[date] = ukw[date] + 1;
        }
      }
    });
    const result = { great, good, meh, bad, awful, ukw };
    return result;
  }

  getPrevious() {
    switch (this.mode) {
      case 'm': this.currentDate.subtract(1, 'M'); break;
      // case 'w': this.currentDate.subtract(4, 'w'); break;
    }
    this.createViewGivenMode();
  }

  getNext() {
    switch (this.mode) {
      case 'm': this.currentDate.add(1, 'M'); break;
      // case 'w': this.currentDate.add(4, 'w'); break;
    }
    this.createViewGivenMode();
  }

}
