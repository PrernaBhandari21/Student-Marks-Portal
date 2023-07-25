import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCompleteReportComponent } from './student-complete-report.component';

describe('StudentCompleteReportComponent', () => {
  let component: StudentCompleteReportComponent;
  let fixture: ComponentFixture<StudentCompleteReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentCompleteReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCompleteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
