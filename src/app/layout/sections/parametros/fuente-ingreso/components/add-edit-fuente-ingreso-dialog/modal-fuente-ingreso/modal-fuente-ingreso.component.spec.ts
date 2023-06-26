import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFuenteIngresoComponent } from './modal-fuente-ingreso.component';

describe('ModalFuenteIngresoComponent', () => {
  let component: ModalFuenteIngresoComponent;
  let fixture: ComponentFixture<ModalFuenteIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFuenteIngresoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFuenteIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
