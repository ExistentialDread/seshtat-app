import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StatsOverallPage } from './stats-overall.page';

describe('StatsOverallPage', () => {
  let component: StatsOverallPage;
  let fixture: ComponentFixture<StatsOverallPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsOverallPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StatsOverallPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
