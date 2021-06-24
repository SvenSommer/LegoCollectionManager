import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunnedSetEditComponent } from './runnedset-edit.component';

describe('SortedsetEditComponent', () => {
  let component: RunnedSetEditComponent;
  let fixture: ComponentFixture<RunnedSetEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunnedSetEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnedSetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
