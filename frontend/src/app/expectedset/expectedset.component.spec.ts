import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedsetComponent } from './expectedset.component';

describe('ExpectedsetComponent', () => {
  let component: ExpectedsetComponent;
  let fixture: ComponentFixture<ExpectedsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectedsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectedsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
