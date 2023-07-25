import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStudentReportComponent } from './create-student-report.component';

describe('CreateStudentReportComponent', () => {
  let component: CreateStudentReportComponent;
  let fixture: ComponentFixture<CreateStudentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStudentReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStudentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
