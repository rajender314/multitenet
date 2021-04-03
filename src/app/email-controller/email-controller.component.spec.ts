import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailControllerComponent } from './email-controller.component';

describe('EmailControllerComponent', () => {
  let component: EmailControllerComponent;
  let fixture: ComponentFixture<EmailControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
