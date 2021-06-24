import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortedsetDetailComponent } from './runnedset-detail.component';

describe('SortedsetDetailComponent', () => {
  let component: SortedsetDetailComponent;
  let fixture: ComponentFixture<SortedsetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortedsetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortedsetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
