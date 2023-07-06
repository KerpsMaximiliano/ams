import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaFacturaFilterComponent } from './empresa-factura-filter.component';

describe('EmpresaFacturaFilterComponent', () => {
  let component: EmpresaFacturaFilterComponent;
  let fixture: ComponentFixture<EmpresaFacturaFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresaFacturaFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaFacturaFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
