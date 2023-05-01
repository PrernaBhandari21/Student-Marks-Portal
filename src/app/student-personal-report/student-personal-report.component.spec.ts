import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPersonalReportComponent } from './student-personal-report.component';

describe('StudentPersonalReportComponent', () => {
  let component: StudentPersonalReportComponent;
  let fixture: ComponentFixture<StudentPersonalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentPersonalReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPersonalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
