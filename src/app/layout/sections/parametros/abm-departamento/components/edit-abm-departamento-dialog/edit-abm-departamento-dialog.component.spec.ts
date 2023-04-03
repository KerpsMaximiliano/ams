import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAbmDepartamentoDialogComponent } from './edit-abm-departamento-dialog.component';

describe('EditAbmDepartamentoDialogComponent', () => {
  let component: EditAbmDepartamentoDialogComponent;
  let fixture: ComponentFixture<EditAbmDepartamentoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAbmDepartamentoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAbmDepartamentoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
