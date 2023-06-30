import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSubmotivoMovimientoComponent } from './add-edit-submotivo-movimiento.component';

describe('AddEditSubmotivoMovimientoComponent', () => {
  let component: AddEditSubmotivoMovimientoComponent;
  let fixture: ComponentFixture<AddEditSubmotivoMovimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSubmotivoMovimientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSubmotivoMovimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
