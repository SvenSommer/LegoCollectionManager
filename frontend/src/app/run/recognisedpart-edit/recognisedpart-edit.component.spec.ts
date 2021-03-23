import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecognisedpartEditComponent } from './recognisedpart-edit.component';

describe('RecognisedpartEditComponent', () => {
  let component: RecognisedpartEditComponent;
  let fixture: ComponentFixture<RecognisedpartEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecognisedpartEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecognisedpartEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
