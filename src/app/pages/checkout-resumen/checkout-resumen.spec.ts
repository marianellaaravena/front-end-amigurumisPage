import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutResumen } from './checkout-resumen';

describe('CheckoutResumen', () => {
  let component: CheckoutResumen;
  let fixture: ComponentFixture<CheckoutResumen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutResumen],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutResumen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
