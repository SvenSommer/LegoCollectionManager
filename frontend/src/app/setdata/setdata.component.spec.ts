import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetdataComponent } from './setdata.component';

describe('SetdataComponent', () => {
  let component: SetdataComponent;
  let fixture: ComponentFixture<SetdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
