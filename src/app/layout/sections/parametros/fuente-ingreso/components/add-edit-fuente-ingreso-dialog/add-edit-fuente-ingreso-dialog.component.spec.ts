import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFuenteIngresoDialogComponent } from './add-edit-fuente-ingreso-dialog.component';

describe('AddEditFuenteIngresoDialogComponent', () => {
  let component: AddEditFuenteIngresoDialogComponent;
  let fixture: ComponentFixture<AddEditFuenteIngresoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditFuenteIngresoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditFuenteIngresoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
