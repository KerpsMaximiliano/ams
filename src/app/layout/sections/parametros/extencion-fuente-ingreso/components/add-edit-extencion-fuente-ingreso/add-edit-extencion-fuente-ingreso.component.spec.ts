import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExtencionFuenteIngresoComponent } from './add-edit-extencion-fuente-ingreso.component';

describe('AddEditExtencionFuenteIngresoComponent', () => {
  let component: AddEditExtencionFuenteIngresoComponent;
  let fixture: ComponentFixture<AddEditExtencionFuenteIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditExtencionFuenteIngresoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditExtencionFuenteIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
