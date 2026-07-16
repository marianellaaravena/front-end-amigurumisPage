import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutEntrega } from './checkout-entrega';

describe('CheckoutEntrega', () => {
  let component: CheckoutEntrega;
  let fixture: ComponentFixture<CheckoutEntrega>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutEntrega],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutEntrega);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
