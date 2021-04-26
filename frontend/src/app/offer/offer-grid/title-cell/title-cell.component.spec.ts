import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleCellComponent } from './title-cell.component';

describe('TextCellComponent', () => {
  let component: TitleCellComponent;
  let fixture: ComponentFixture<TitleCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
