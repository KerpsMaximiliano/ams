import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoNacionalidadFilterComponent } from './tipo-nacionalidad-filter.component';

describe('TipoNacionalidadFilterComponent', () => {
  let component: TipoNacionalidadFilterComponent;
  let fixture: ComponentFixture<TipoNacionalidadFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoNacionalidadFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoNacionalidadFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
