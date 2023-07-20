import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaFacturaComponent } from './empresa-factura.component';

describe('EmpresaFacturaComponent', () => {
  let component: EmpresaFacturaComponent;
  let fixture: ComponentFixture<EmpresaFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresaFacturaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
