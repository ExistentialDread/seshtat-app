import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MountainsPage } from './mountains.page';

describe('MountainsPage', () => {
  let component: MountainsPage;
  let fixture: ComponentFixture<MountainsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MountainsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MountainsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
