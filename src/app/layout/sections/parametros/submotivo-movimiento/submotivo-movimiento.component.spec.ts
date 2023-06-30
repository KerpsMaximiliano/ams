import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmotivoMovimientoComponent } from './submotivo-movimiento.component';

describe('SubmotivoMovimientoComponent', () => {
  let component: SubmotivoMovimientoComponent;
  let fixture: ComponentFixture<SubmotivoMovimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmotivoMovimientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmotivoMovimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
