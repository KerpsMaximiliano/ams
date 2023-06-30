import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmotivoMovimientoFilterComponent } from './submotivo-movimiento-filter.component';

describe('SubmotivoMovimientoFilterComponent', () => {
  let component: SubmotivoMovimientoFilterComponent;
  let fixture: ComponentFixture<SubmotivoMovimientoFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmotivoMovimientoFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmotivoMovimientoFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
