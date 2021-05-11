import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextCellComponent } from './text-cell.component';

describe('TextCellComponent', () => {
  let component: TextCellComponent;
  let fixture: ComponentFixture<TextCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
