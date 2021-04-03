import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessFeaturesComponent } from './access-features.component';

describe('AccessFeaturesComponent', () => {
  let component: AccessFeaturesComponent;
  let fixture: ComponentFixture<AccessFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
