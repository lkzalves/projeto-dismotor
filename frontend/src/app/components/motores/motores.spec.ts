import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Motores } from './motores';

describe('Motores', () => {
  let component: Motores;
  let fixture: ComponentFixture<Motores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Motores],
    }).compileComponents();

    fixture = TestBed.createComponent(Motores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
