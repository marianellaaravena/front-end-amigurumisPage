import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutDatos } from './checkout-datos';

describe('CheckoutDatos', () => {
  let component: CheckoutDatos;
  let fixture: ComponentFixture<CheckoutDatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutDatos],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutDatos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
