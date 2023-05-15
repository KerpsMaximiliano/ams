import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuenteIngresoDashboardComponent } from './fuente-ingreso-dashboard.component';

describe('FuenteIngresoDashboardComponent', () => {
  let component: FuenteIngresoDashboardComponent;
  let fixture: ComponentFixture<FuenteIngresoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuenteIngresoDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuenteIngresoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
