import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequirementsPage } from './requirements.page';

describe('RequirementsPage', () => {
  let component: RequirementsPage;
  let fixture: ComponentFixture<RequirementsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequirementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
