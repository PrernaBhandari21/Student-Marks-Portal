import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingReportsListComponent } from './existing-reports-list.component';

describe('ExistingReportsListComponent', () => {
  let component: ExistingReportsListComponent;
  let fixture: ComponentFixture<ExistingReportsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingReportsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
