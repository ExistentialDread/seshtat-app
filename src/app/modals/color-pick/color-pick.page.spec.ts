import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ColorPickPage } from './color-pick.page';

describe('ColorPickPage', () => {
  let component: ColorPickPage;
  let fixture: ComponentFixture<ColorPickPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPickPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPickPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
