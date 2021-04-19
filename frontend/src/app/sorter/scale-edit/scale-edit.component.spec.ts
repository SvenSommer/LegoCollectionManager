import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaleEditComponent } from './scale-edit.component';

describe('ScaleEditComponent', () => {
  let component: ScaleEditComponent;
  let fixture: ComponentFixture<ScaleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScaleEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScaleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
