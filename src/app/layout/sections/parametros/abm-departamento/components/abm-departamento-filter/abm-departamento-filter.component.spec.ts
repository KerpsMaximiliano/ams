import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmDepartamentoFilterComponent } from './abm-departamento-filter.component';

describe('TipoNacionalidadFilterComponent', () => {
  let component: AbmDepartamentoFilterComponent;
  let fixture: ComponentFixture<AbmDepartamentoFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmDepartamentoFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmDepartamentoFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
