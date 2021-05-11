import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCellComponent } from './delete-cell.component';

describe('DeleteCellComponent', () => {
  let component: DeleteCellComponent;
  let fixture: ComponentFixture<DeleteCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
