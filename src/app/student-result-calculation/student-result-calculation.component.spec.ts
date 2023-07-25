import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentResultCalculationComponent } from './student-result-calculation.component';

describe('StudentResultCalculationComponent', () => {
  let component: StudentResultCalculationComponent;
  let fixture: ComponentFixture<StudentResultCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentResultCalculationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentResultCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
