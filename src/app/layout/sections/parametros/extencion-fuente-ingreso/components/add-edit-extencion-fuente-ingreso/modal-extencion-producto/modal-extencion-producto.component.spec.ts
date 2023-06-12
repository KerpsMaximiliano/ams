import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExtencionProductoComponent } from './modal-extencion-producto.component';

describe('ModalExtencionProductoComponent', () => {
  let component: ModalExtencionProductoComponent;
  let fixture: ComponentFixture<ModalExtencionProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalExtencionProductoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalExtencionProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
