import { Component, Inject } from '@angular/core';

// * Form
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Validations
import {
  isAlphanumericWithSpaces,
  isAlphanumeric,
  getErrorMessage,
  notOnlySpaces,
} from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-estado-civil-dialog',
  templateUrl: './add-edit-estado-civil-dialog.component.html',
  styleUrls: ['./add-edit-estado-civil-dialog.component.scss'],
})
export class AddEditEstadoCivilDialogComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   * 1. 'this.setUpForm();': Asigna las validaciones correspondientes a cada campo de entrada/selección.
   * 2. Condición: comprueba que sea una actualización (modificación) o lectura.
   * 3. 'this.setFormValues();': Asigna los valores de 'data' a los campos de entrada/selección del formulario.
   * 4. Condición: comprueba si la edición esta deshabilitada.
   *     > Deshabilidada: deshabilita el formulario.
   *     > Habilitada: deshabilita el 'codigo_estado_civil'.
   */
  ngOnInit(): void {
    this.setUpForm();
    if (this.data.par_modo === 'U' || this.data.par_modo === 'R') {
      this.setFormValues();
      if (this.data.edit === false) {
        this.formGroup.disable();
      } else {
        this.formGroup.get('codigo_estado_civil')?.disable();
      }
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_estado_civil: new UntypedFormControl(
        this.data.codigo_estado_civil,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlphanumeric(),
        ])
      ),
      description: new UntypedFormControl(
        this.data.description ? this.data.description.trim() : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          isAlphanumericWithSpaces(),
          notOnlySpaces(),
        ])
      ),
    });
  }

  private setFormValues(): void {
    this.formGroup
      .get('codigo_estado_civil')
      ?.setValue(this.data.codigo_estado_civil);
    this.formGroup
      .get('description')
      ?.setValue(this.data.description ? this.data.description.trim() : '');
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        codigo_estado_civil: this.formGroup.get('codigo_estado_civil')?.value,
        description: this.formGroup.get('description')?.value,
      });
    }
  }
}
