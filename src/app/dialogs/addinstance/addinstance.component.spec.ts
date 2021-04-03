import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddinstanceComponent } from './addinstance.component';

describe('AddinstanceComponent', () => {
  let component: AddinstanceComponent;
  let fixture: ComponentFixture<AddinstanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddinstanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddinstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
