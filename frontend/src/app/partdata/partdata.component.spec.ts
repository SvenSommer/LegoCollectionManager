import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartdataComponent } from './partdata.component';

describe('PartdataComponent', () => {
  let component: PartdataComponent;
  let fixture: ComponentFixture<PartdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
