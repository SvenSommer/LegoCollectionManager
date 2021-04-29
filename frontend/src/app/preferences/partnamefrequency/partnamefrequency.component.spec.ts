import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnamefrequencyComponent } from './partnamefrequency.component';

describe('PartnamefrequencyComponent', () => {
  let component: PartnamefrequencyComponent;
  let fixture: ComponentFixture<PartnamefrequencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnamefrequencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnamefrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
