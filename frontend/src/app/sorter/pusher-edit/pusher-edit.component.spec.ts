import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PusherEditComponent } from './pusher-edit.component';

describe('PusherEditComponent', () => {
  let component: PusherEditComponent;
  let fixture: ComponentFixture<PusherEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PusherEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PusherEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
