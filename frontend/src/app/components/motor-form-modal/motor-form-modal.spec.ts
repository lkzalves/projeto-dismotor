import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorFormModal } from './motor-form-modal';

describe('MotorFormModal', () => {
  let component: MotorFormModal;
  let fixture: ComponentFixture<MotorFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotorFormModal],
    }).compileComponents();

    fixture = TestBed.createComponent(MotorFormModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
