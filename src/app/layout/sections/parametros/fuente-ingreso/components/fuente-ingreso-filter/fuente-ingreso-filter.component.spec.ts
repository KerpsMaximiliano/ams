import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuenteIngresoFilterComponent } from './fuente-ingreso-filter.component';

describe('FuenteIngresoFilterComponent', () => {
  let component: FuenteIngresoFilterComponent;
  let fixture: ComponentFixture<FuenteIngresoFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuenteIngresoFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuenteIngresoFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
