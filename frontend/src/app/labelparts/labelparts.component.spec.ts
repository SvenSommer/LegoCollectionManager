import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelpartsComponent } from './labelparts.component';

describe('LabelpartsComponent', () => {
  let component: LabelpartsComponent;
  let fixture: ComponentFixture<LabelpartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelpartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelpartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
