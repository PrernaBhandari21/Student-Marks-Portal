import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperWiseResultCalculationComponent } from './paper-wise-result-calculation.component';

describe('PaperWiseResultCalculationComponent', () => {
  let component: PaperWiseResultCalculationComponent;
  let fixture: ComponentFixture<PaperWiseResultCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaperWiseResultCalculationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperWiseResultCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
