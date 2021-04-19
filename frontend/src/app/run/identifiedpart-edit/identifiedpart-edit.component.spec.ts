import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifiedpartEditComponent } from './identifiedpart-edit.component';

describe('IdentifiedpartEditComponent', () => {
  let component: IdentifiedpartEditComponent;
  let fixture: ComponentFixture<IdentifiedpartEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentifiedpartEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifiedpartEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
