import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperWiseStudentReportComponent } from './paper-wise-student-report.component';

describe('PaperWiseStudentReportComponent', () => {
  let component: PaperWiseStudentReportComponent;
  let fixture: ComponentFixture<PaperWiseStudentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaperWiseStudentReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperWiseStudentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
