import { Component, Inject } from '@angular/core';

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
  isAlphanumeric,
  isAlphanumericWithSpaces,
  isNumeric,
  isPercentage,
} from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-provincia-dialog',
  templateUrl: './add-edit-provincia-dialog.component.html',
  styleUrls: ['./add-edit-provincia-dialog.component.scss'],
})
export class AddEditProvinciaDialogComponent {
  public formGroup: UntypedFormGroup;

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
   *     > Habilitada: deshabilita el 'codigo'.
   */
  ngOnInit(): void {
    this.setUpForm();
    if (this.data.par_modo === 'U' || this.data.par_modo === 'R') {
      this.setFormValues();
      if (this.data.edit === false) {
        this.formGroup.disable();
      } else {
        this.formGroup.get('codigo')?.disable();
      }
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlphanumeric(), // Remplazar por alfabetico.
        ])
      ),
      nombre_provincia: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          isAlphanumericWithSpaces(),
        ])
      ),
      codifica_altura: new UntypedFormControl(
        'N',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          // Validación: Alfabetico.
        ])
      ),
      codigo_provincia: new UntypedFormControl(
        '', // Verificar
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric(), // Verificar.
        ])
      ),
      flete_transportista: new UntypedFormControl(
        '', // Verificar
        Validators.compose([Validators.maxLength(6), isPercentage()]) // Verificar isPercentage().
      ),
    });
  }

  private setFormValues(): void {
    this.formGroup.get('codigo')?.setValue(this.data.codigo);
    this.formGroup
      .get('nombre_provincia')
      ?.setValue(this.data.nombre_provincia);
    this.formGroup.patchValue({
      codifica_altura: this.data.codifica_altura,
    });
    this.formGroup
      .get('codigo_provincia')
      ?.setValue(this.data.codigo_provincia);
    this.formGroup
      .get('flete_transportista')
      ?.setValue(this.data.flete_transportista);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        codigo: this.formGroup.get('codigo')?.value,
        nombre_provincia: this.formGroup.get('nombre_provincia')?.value,
        codifica_altura: this.formGroup.get('codifica_altura')?.value,
        codigo_provincia: this.formGroup.get('codigo_provincia')?.value,
        flete_transportista: this.formGroup.get('flete_transportista')?.value,
      });
    }
  }

  getErrorMessage(control: any) {
    if (control.errors?.['required']) {
      return `Campo requerido`;
    } else {
      if (control.errors?.['maxlength']) {
        return `No puede contener más de ${control.errors?.['maxlength'].requiredLength} caracteres`;
      }
      if (control.errors?.['minlength']) {
        return `Debe contener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
      }
      if (
        (control.errors?.['notAlphanumeric'] ||
          control.errors?.['notAlphanumericWithSpaces']) &&
        control.value != '' &&
        control.value != null
      ) {
        return `No puede contener caracteres especiales`;
      }
      if (
        (control.errors?.['notNumeric'] || control.errors?.['notNumeric']) &&
        control.value != '' &&
        control.value != null
      ) {
        return `Solo admite numeros`;
      }
      if (
        (control.errors?.['notPercentage'] ||
          control.errors?.['notPercentage']) &&
        control.value != '' &&
        control.value != null
      ) {
        return `Debe ser un numero que indique procentaje. Ej: 1.5`;
      }
      if (control.errors?.['pattern']) {
        return `No puede contener letras, caracteres especiales`;
      }
    }
    return '';
  }
}
