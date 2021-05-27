import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortedsetComponent } from './sortedset.component';

describe('SortedsetComponent', () => {
  let component: SortedsetComponent;
  let fixture: ComponentFixture<SortedsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortedsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortedsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
