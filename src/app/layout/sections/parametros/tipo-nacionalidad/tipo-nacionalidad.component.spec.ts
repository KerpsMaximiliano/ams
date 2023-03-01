import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoNacionalidadComponent } from './tipo-nacionalidad.component';

describe('TipoNacionalidadComponent', () => {
  let component: TipoNacionalidadComponent;
  let fixture: ComponentFixture<TipoNacionalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoNacionalidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoNacionalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
