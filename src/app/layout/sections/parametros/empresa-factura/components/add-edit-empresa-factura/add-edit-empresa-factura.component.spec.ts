import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEmpresaFacturaComponent } from './add-edit-empresa-factura.component';

describe('AddEditEmpresaFacturaComponent', () => {
  let component: AddEditEmpresaFacturaComponent;
  let fixture: ComponentFixture<AddEditEmpresaFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditEmpresaFacturaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditEmpresaFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
