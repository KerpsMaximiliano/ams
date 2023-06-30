import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmotivoMovimientoDashboardComponent } from './submotivo-movimiento-dashboard.component';

describe('SubmotivoMovimientoDashboardComponent', () => {
  let component: SubmotivoMovimientoDashboardComponent;
  let fixture: ComponentFixture<SubmotivoMovimientoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmotivoMovimientoDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmotivoMovimientoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
