import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OlympusPage } from './olympus.page';

describe('OlympusPage', () => {
  let component: OlympusPage;
  let fixture: ComponentFixture<OlympusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlympusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OlympusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
