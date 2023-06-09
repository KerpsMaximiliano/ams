import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtencionFuenteIngresoFilterComponent } from './extencion-fuente-ingreso-filter.component';

describe('ExtencionFuenteIngresoFilterComponent', () => {
  let component: ExtencionFuenteIngresoFilterComponent;
  let fixture: ComponentFixture<ExtencionFuenteIngresoFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtencionFuenteIngresoFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtencionFuenteIngresoFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
