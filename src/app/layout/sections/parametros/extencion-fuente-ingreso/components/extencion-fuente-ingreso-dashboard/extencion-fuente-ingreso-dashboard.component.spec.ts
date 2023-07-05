import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtencionFuenteIngresoDashboardComponent } from './extencion-fuente-ingreso-dashboard.component';

describe('ExtencionFuenteIngresoDashboardComponent', () => {
  let component: ExtencionFuenteIngresoDashboardComponent;
  let fixture: ComponentFixture<ExtencionFuenteIngresoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtencionFuenteIngresoDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtencionFuenteIngresoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
