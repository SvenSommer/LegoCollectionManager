import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionCellComponent } from './description-cell.component';

describe('DescriptionCellComponent', () => {
  let component: DescriptionCellComponent;
  let fixture: ComponentFixture<DescriptionCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
