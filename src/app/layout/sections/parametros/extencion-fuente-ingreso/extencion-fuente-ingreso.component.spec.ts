import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtencionFuenteIngresoComponent } from './extencion-fuente-ingreso.component';

describe('ExtencionFuenteIngresoComponent', () => {
  let component: ExtencionFuenteIngresoComponent;
  let fixture: ComponentFixture<ExtencionFuenteIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtencionFuenteIngresoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtencionFuenteIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
