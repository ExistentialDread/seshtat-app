import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges} from '@angular/core';

@Component({
  selector: 'app-icon-toggle',
  templateUrl: './icon-toggle.component.html',
  styleUrls: ['./icon-toggle.component.scss'],
})
export class IconToggleComponent implements OnInit, OnChanges {
  @Input() icon: string;
  @Input() label: string;
  @Input() selected: boolean;
  @Output() toggled: EventEmitter<boolean> = new EventEmitter();

  public fill = 'outline';

  constructor() { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    const { selected } = changes;
    if (selected) {
      this.fill = (this.selected) ? 'solid' : 'outline';
    }
  }

  onToggled() {
    this.toggled.emit(this.selected);
  }

}
