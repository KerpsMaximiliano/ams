import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDepartamentoDialogComponent } from './add-edit-departamento-dialog.component';

describe('EditAbmDepartamentoDialogComponent', () => {
  let component: AddEditDepartamentoDialogComponent;
  let fixture: ComponentFixture<AddEditDepartamentoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditDepartamentoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDepartamentoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
