import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartdataDetailComponent } from './partdata-detail.component';

describe('PartdataDetailComponent', () => {
  let component: PartdataDetailComponent;
  let fixture: ComponentFixture<PartdataDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartdataDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartdataDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
