import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesCellComponent } from './images-cell.component';

describe('ImagesCellComponent', () => {
  let component: ImagesCellComponent;
  let fixture: ComponentFixture<ImagesCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
