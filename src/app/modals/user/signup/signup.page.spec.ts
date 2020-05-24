import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupPage as SignupModal } from './signup.page';

describe('SignupPage', () => {
  let component: SignupModal;
  let fixture: ComponentFixture<SignupModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupModal ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
