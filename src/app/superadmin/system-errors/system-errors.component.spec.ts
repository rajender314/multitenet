import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemErrorsComponent } from './system-errors.component';

describe('SystemErrorsComponent', () => {
  let component: SystemErrorsComponent;
  let fixture: ComponentFixture<SystemErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemErrorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
