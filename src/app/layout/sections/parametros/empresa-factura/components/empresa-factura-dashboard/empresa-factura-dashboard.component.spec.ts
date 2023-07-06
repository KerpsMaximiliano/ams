import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaFacturaDashboardComponent } from './empresa-factura-dashboard.component';

describe('EmpresaFacturaDashboardComponent', () => {
  let component: EmpresaFacturaDashboardComponent;
  let fixture: ComponentFixture<EmpresaFacturaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresaFacturaDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaFacturaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
