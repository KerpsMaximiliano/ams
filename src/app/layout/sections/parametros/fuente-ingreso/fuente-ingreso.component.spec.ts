import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuenteIngresoComponent } from './fuente-ingreso.component';

describe('FuenteIngresoComponent', () => {
  let component: FuenteIngresoComponent;
  let fixture: ComponentFixture<FuenteIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuenteIngresoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuenteIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
