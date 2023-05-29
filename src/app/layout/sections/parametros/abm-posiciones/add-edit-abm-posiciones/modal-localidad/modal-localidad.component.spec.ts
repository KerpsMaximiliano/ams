import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLocalidadComponent } from './modal-localidad.component';

describe('ModalLocalidadComponent', () => {
  let component: ModalLocalidadComponent;
  let fixture: ComponentFixture<ModalLocalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalLocalidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalLocalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
