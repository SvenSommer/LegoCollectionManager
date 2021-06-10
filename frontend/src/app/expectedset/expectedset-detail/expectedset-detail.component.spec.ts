import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedsetDetailComponent } from './expectedset-detail.component';

describe('ExpectedsetDetailComponent', () => {
  let component: ExpectedsetDetailComponent;
  let fixture: ComponentFixture<ExpectedsetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectedsetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectedsetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
