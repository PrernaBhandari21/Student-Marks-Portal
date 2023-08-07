import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPaperWiseHeadersComponent } from './select-paper-wise-headers.component';

describe('SelectPaperWiseHeadersComponent', () => {
  let component: SelectPaperWiseHeadersComponent;
  let fixture: ComponentFixture<SelectPaperWiseHeadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPaperWiseHeadersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectPaperWiseHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
