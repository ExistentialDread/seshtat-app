import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DayService } from '@data/services';
import { AlertService } from '@core/services';

@Component({
  selector: 'app-stats-absurd',
  templateUrl: './stats-absurd.page.html',
  styleUrls: ['./stats-absurd.page.scss'],
})
export class StatsAbsurdPage implements OnInit, OnDestroy {

  private subs: Subscription[] = [];

  constructor(private dayService: DayService, private alertService: AlertService) { }

  public stateChartOptions;

  ngOnInit() {
    const sub = this.dayService.getRevoltState().subscribe(days => {
      this.createStateChart(days);
    }, err => this.alertService.error(err));
    this.subs.push(sub);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  createStateChart(data) {
    this.stateChartOptions = {
      title: {
        text: 'State of the Absurd',
        left: 'center',
        top: 'top'
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        show: false,
        type: 'value',
        min: -20,
        max: 20,
      },
      grid: [
        { bottom: 80 }, { bottom: 80 }
      ],
      dataZoom: [
        {
          type: 'inside',
          filterMode: 'none',
        },
        {}
      ],
      visualMap: {
        show: false,
        dimension: 1,
        pieces: [{
          lt: -10,
          gte: -20,
          color: '#E66300'
        }, {
          lt: 0,
          gte: -10,
          color: '#F78C1E'
        }, {
          lt: 10,
          gte: 0,
          color: '#4F6269'
        }, {
          lte: 20,
          gte: 10,
          color: '#7FC01D'
        }]
      },
      series: [{
        name: 'Revolt',
        type: 'line',
        smooth: true,
        data: data.map(d => { return [d.date, d.value]; }),
        markArea: {
          silent: true,
          label: { position: 'left', color: '#477A00', rotate: 90, offset: [-5, -15] },
          itemStyle: { color: 'rgba(71, 122, 0, 0.1)' },
          data: [
            [{ name: 'Revolt', yAxis: 10 }, { yAxis: 20 }]
          ]
        }
      },
      {
        name: 'Satisfaction',
        type: 'line',
        markArea: {
          silent: true,
          label: { position: 'left', color: '#4F6269', rotate: 90, offset: [-5, -34] },
          itemStyle: { color: 'rgba(79, 98, 105, 0.1)' },
          data: [
            [{ name: 'Satisfaction', yAxis: 0 }, { yAxis: 10 }]
          ]
        }
      },
      {
        name: 'Hopefullness',
        type: 'line',
        markArea: {
          silent: true,
          label: { position: 'left', color: '#E66300', rotate: 90, offset: [-5, -36] },
          itemStyle: { color: 'rgba(230, 99, 0, 0.1)' },
          data: [
            [{ name: 'Hopefullness', yAxis: 0 }, { yAxis: -10 }]
          ]
        }
      },
      {
        name: 'Depression',
        type: 'line',
        markArea: {
          silent: true,
          label: { position: 'left', color: '#CD6A6F', rotate: 90, offset: [-5, -34] },
          itemStyle: { color: 'rgba(205, 106, 111, 0.2)' },
          data: [
            [{ name: 'Depression', yAxis: -10 }, { yAxis: -20 }]
          ]
        }
      },
      ]
    }
  }

}
