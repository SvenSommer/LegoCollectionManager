import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedpartEditComponent } from './purchasedpart-edit.component';

describe('PurchasedpartEditComponent', () => {
  let component: PurchasedpartEditComponent;
  let fixture: ComponentFixture<PurchasedpartEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasedpartEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasedpartEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
