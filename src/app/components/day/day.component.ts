import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Day, Settings } from '@data/models';
import * as moment from 'moment';
import { SettingsService } from '@data/services';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})
export class DayComponent implements OnInit, OnChanges {

  @Input() day: Day;
  @Input() format: string;
  @Input() settings: Settings;
  @Input() show: boolean;
  @Output() selected: EventEmitter<Day> = new EventEmitter();

  public today = false;

  public faces;

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.faces = this.settingsService.faces;
  }

  ngOnChanges() {
    this.today = this.day.date.isSame(moment.utc(), 'day');
  }

  getDay() {
    const date = this.day.date;
    return (date.get('date') > 1) ? (this.format) ? date.format(this.format) : date.get('date') : date.format('MMM D');
  }

  onClick() {
    this.selected.emit(this.day);
  }

}
