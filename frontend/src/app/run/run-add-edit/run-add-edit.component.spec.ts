import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunAddEditComponent } from './run-add-edit.component';

describe('RunAddEditComponent', () => {
  let component: RunAddEditComponent;
  let fixture: ComponentFixture<RunAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
