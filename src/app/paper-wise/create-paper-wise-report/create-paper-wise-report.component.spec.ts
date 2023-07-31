import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePaperWiseReportComponent } from './create-paper-wise-report.component';

describe('CreatePaperWiseReportComponent', () => {
  let component: CreatePaperWiseReportComponent;
  let fixture: ComponentFixture<CreatePaperWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePaperWiseReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePaperWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
