import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoNacionalidadDashboardComponent } from './abm-departamento-dashboard.component';

describe('TipoNacionalidadDashboardComponent', () => {
  let component: TipoNacionalidadDashboardComponent;
  let fixture: ComponentFixture<TipoNacionalidadDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoNacionalidadDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoNacionalidadDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
