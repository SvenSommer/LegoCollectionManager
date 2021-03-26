import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDetailComponent } from './set-detail.component';

describe('SetDetailComponent', () => {
  let component: SetDetailComponent;
  let fixture: ComponentFixture<SetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
