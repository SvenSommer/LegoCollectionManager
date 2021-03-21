import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SorterDetailComponent } from './sorter-detail.component';

describe('SorterDetailComponent', () => {
  let component: SorterDetailComponent;
  let fixture: ComponentFixture<SorterDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SorterDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SorterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
