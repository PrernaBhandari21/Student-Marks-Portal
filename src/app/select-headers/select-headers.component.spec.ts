import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectHeadersComponent } from './select-headers.component';

describe('SelectHeadersComponent', () => {
  let component: SelectHeadersComponent;
  let fixture: ComponentFixture<SelectHeadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectHeadersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
