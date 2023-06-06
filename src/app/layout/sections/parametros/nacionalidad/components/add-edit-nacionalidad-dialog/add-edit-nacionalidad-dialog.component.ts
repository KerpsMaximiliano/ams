import { Component, Inject } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import {
  isAlphanumericWithSpaces,
  getErrorMessage,
} from 'src/app/core/validators/character.validator';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-nacionalidad-dialog',
  templateUrl: './add-edit-nacionalidad-dialog.component.html',
  styleUrls: ['./add-edit-nacionalidad-dialog.component.scss'],
})
export class AddEditNacionalidadDialogComponent {
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
   *     > Habilitada: deshabilita el 'codigo_nacionalidad_nuevo'.
   */
  ngOnInit(): void {
    this.setUpForm();
    if (this.data.par_modo === 'U' || this.data.par_modo === 'R') {
      this.setFormValues();
      if (this.data.edit === false) {
        this.formGroup.disable();
      } else {
        this.formGroup.get('codigo_nacionalidad_nuevo')?.disable();
      }
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_nacionalidad_nuevo: new UntypedFormControl(
        this.data.codigo_nacionalidad_nuevo,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          Validators.pattern('^[0-9]*$'),
        ])
      ),
      descripcion: new UntypedFormControl(
        this.data.descripcion ? this.data.descripcion.trim() : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          isAlphanumericWithSpaces,
        ])
      ),
      codigo_sistema_anterior: new UntypedFormControl(
        this.data.codigo_sistema_anterior,
        Validators.compose([
          Validators.maxLength(3),
          Validators.pattern('^[0-9]*$'),
        ])
      ),
    });
  }

  private setFormValues(): void {
    this.formGroup
      .get('codigo_nacionalidad_nuevo')
      ?.setValue(this.data.codigo_nacionalidad_nuevo);
    this.formGroup
      .get('descripcion')
      ?.setValue(this.data.descripcion ? this.data.descripcion.trim() : '');
    this.formGroup
      .get('codigo_sistema_anterior')
      ?.setValue(this.data.codigo_sistema_anterior);
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        codigo_nacionalidad_nuevo: this.formGroup.get(
          'codigo_nacionalidad_nuevo'
        )?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        codigo_sistema_anterior: this.formGroup.get('codigo_sistema_anterior')
          ?.value,
      });
    }
  }
}
