import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesEditComponent } from './types-edit.component';

describe('TypesEditComponent', () => {
  let component: TypesEditComponent;
  let fixture: ComponentFixture<TypesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
