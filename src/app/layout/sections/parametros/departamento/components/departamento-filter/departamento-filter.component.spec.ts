import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartamentoFilterComponent } from './departamento-filter.component';

describe('TipoNacionalidadFilterComponent', () => {
  let component: DepartamentoFilterComponent;
  let fixture: ComponentFixture<DepartamentoFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartamentoFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartamentoFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
