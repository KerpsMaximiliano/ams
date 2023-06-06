import { Component, Inject } from '@angular/core';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Validators
import {
  isAlphanumericWithSpaces,
  isNumeric,
  getErrorMessage,
} from 'src/app/core/validators/character.validator';

// * Componentes
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-condicion-iva-dialog',
  templateUrl: './add-edit-condicion-iva-dialog.component.html',
  styleUrls: ['./add-edit-condicion-iva-dialog.component.scss'],
})
export class AddEditCondicionIvaDialogComponent {
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
   *     > Habilitada: deshabilita el 'codigo_de_IVA'.
   */
  ngOnInit(): void {
    this.setUpForm();
    if (this.data.par_modo === 'U' || this.data.par_modo === 'R') {
      this.setFormValues();
      if (this.data.edit === false) {
        this.formGroup.disable();
      } else {
        this.formGroup.get('codigo_de_IVA')?.disable();
      }
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_de_IVA: new UntypedFormControl(
        this.data.codigo_de_IVA,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric(),
        ])
      ),
      descripcion: new UntypedFormControl(
        this.data.descripcion ? this.data.descripcion.trim() : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          isAlphanumericWithSpaces(),
        ])
      ),
      descripcion_reducida: new UntypedFormControl(
        this.data.descripcion_reducida
          ? this.data.descripcion_reducida.trim()
          : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(8),
        ])
      ),
      formulario_AB: new UntypedFormControl(
        this.data.formulario_AB,
        Validators.compose([Validators.required])
      ),
    });
  }

  private setFormValues(): void {
    this.formGroup.get('codigo_de_IVA')?.setValue(this.data.codigo_de_IVA);
    this.formGroup
      .get('descripcion')
      ?.setValue(this.data.descripcion ? this.data.descripcion.trim() : '');
    this.formGroup
      .get('descripcion_reducida')
      ?.setValue(
        this.data.descripcion_reducida
          ? this.data.descripcion_reducida.trim()
          : ''
      );
    this.formGroup.get('formulario_AB')?.patchValue(this.data.formulario_AB);
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        codigo_de_IVA: this.formGroup.get('codigo_de_IVA')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        descripcion_reducida: this.formGroup.get('descripcion_reducida')?.value,
        formulario_AB: this.formGroup.get('formulario_AB')?.value,
      });
    }
  }
}
