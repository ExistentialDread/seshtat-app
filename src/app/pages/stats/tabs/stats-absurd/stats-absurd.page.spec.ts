import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StatsAbsurdPage } from './stats-absurd.page';

describe('StatsAbsurdPage', () => {
  let component: StatsAbsurdPage;
  let fixture: ComponentFixture<StatsAbsurdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsAbsurdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StatsAbsurdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
