import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectStudentHeaderComponent } from './select-student-header.component';

describe('SelectStudentHeaderComponent', () => {
  let component: SelectStudentHeaderComponent;
  let fixture: ComponentFixture<SelectStudentHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectStudentHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectStudentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
