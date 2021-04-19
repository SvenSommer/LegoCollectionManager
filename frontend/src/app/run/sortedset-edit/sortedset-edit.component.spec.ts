import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortedsetEditComponent } from './sortedset-edit.component';

describe('SortedsetEditComponent', () => {
  let component: SortedsetEditComponent;
  let fixture: ComponentFixture<SortedsetEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortedsetEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortedsetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
