import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTipoNacionalidadDialogComponent } from './edit-tipo-nacionalidad-dialog.component';

describe('EditTipoNacionalidadDialogComponent', () => {
  let component: EditTipoNacionalidadDialogComponent;
  let fixture: ComponentFixture<EditTipoNacionalidadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTipoNacionalidadDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTipoNacionalidadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
