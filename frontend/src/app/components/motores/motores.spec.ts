import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoresComponent } from './motores';

describe('Motores', () => {
  let component: MotoresComponent;
  let fixture: ComponentFixture<MotoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotoresComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MotoresComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
