import { Component, Inject } from '@angular/core';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import {
  isAlphanumericWithSpaces,
  getErrorMessage,
  notOnlySpaces,
  isNumeric,
} from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-departamento-dialog',
  templateUrl: './add-edit-departamento-dialog.component.html',
  styleUrls: ['./add-edit-departamento-dialog.component.scss'],
})
export class AddEditDepartamentoDialogComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  public provincias: IProvincia[];

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
   *     > Habilitada: deshabilita el 'letra_provincia'.
   */
  ngOnInit(): void {
    this.provincias = this.data.provincias;
    this.setUpForm();
    if (this.data.par_modo !== 'C') {
      this.setFormValues();
      this.formGroup.get('nombre_provincia')?.disable();
      this.formGroup.get('codigo_departamento')?.disable();
      if (this.data.edit !== true) {
        this.formGroup.disable();
      }
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      nombre_provincia: new UntypedFormControl(
        this.data.nombre_provincia ? this.data.nombre_provincia.trim() : '',
        Validators.compose([Validators.required])
      ),
      codigo_departamento: new UntypedFormControl(
        this.data.codigo_departamento,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          isNumeric(),
        ])
      ),
      descripcion: new UntypedFormControl(
        this.data.descripcion ? this.data.descripcion.trim() : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          isAlphanumericWithSpaces(),
          notOnlySpaces(),
        ])
      ),
      descripcion_reducida: new UntypedFormControl(
        this.data.descripcion_reducida
          ? this.data.descripcion_reducida.trim()
          : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
          isAlphanumericWithSpaces(),
          notOnlySpaces(),
        ])
      ),
    });
  }

  private setFormValues(): void {
    this.formGroup
      .get('nombre_provincia')
      ?.setValue(this.findNombreProvinciaByCodigo(this.data.letra_provincia));
    this.formGroup
      .get('codigo_departamento')
      ?.setValue(this.data.codigo_departamento);
    this.formGroup
      .get('codigo_departamento')
      ?.setValue(this.data.codigo_departamento);
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
  }

  private findNombreProvinciaByCodigo(letra_provincia: string): string {
    const provincia = this.provincias.find(
      (provincia) => provincia.codigo === letra_provincia
    );
    return provincia ? provincia.nombre_provincia : '';
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        letra_provincia:
          this.data.par_modo === 'C'
            ? this.formGroup.get('nombre_provincia')?.value
            : this.data.letra_provincia,
        codigo_departamento: this.formGroup.get('codigo_departamento')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        descripcion_reducida: this.formGroup.get('descripcion_reducida')?.value,
      });
    }
  }
}
