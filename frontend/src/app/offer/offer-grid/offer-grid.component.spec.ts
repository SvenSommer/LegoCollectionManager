import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferGridComponent } from './offer-grid.component';

describe('OfferGridComponent', () => {
  let component: OfferGridComponent;
  let fixture: ComponentFixture<OfferGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
