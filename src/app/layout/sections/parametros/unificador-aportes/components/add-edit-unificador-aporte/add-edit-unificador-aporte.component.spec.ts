import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUnificadorAporteComponent } from './add-edit-unificador-aporte.component';

describe('AddEditUnificadorAporteComponent', () => {
  let component: AddEditUnificadorAporteComponent;
  let fixture: ComponentFixture<AddEditUnificadorAporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditUnificadorAporteComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddEditUnificadorAporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
