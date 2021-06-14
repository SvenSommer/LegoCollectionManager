import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderitemDetailComponent } from './orderitem-detail.component';

describe('OrderitemDetailComponent', () => {
  let component: OrderitemDetailComponent;
  let fixture: ComponentFixture<OrderitemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderitemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderitemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
