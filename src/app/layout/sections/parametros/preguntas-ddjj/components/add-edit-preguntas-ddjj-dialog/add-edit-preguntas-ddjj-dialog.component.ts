import { Component, Inject } from '@angular/core';

// * Form - Validations
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  notOnlySpacesValidator,
  isAlphanumericWithSpaces,
  isNumeric,
  notZeroValidator,
} from 'src/app/core/validators/character.validator';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-preguntas-ddjj-dialog',
  templateUrl: './add-edit-preguntas-ddjj-dialog.component.html',
  styleUrls: ['./add-edit-preguntas-ddjj-dialog.component.scss'],
})
export class AddEditPreguntasDDJJDialogComponent {
  public formGroup: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.setUpForm();
    if (this.data.nro_preg) this.setFormValues();
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      modelo_formulario: new UntypedFormControl(
        this.data.modelo_formulario,
      ),
      nro_preg: new UntypedFormControl({
        value: this.data.nro_preg,
        disabled: this.data.par_modo === 'U',
      }),
      cantidad_lineas_resp: new UntypedFormControl(
        this.data.cantidad_lineas_resp,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          notZeroValidator(),
          isNumeric(),
        ])
      ),
      pide_fecha: new UntypedFormControl(
        Validators.compose([Validators.required])
      ),
      yes_no: new UntypedFormControl(Validators.compose([Validators.required])),
      primer_texto_preg: new UntypedFormControl(
        this.data.primer_texto_preg,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          isAlphanumericWithSpaces(),
        ])
      ),
      segundo_texto_preg: new UntypedFormControl(
        this.data.segundo_texto_preg,
        Validators.compose([
          Validators.maxLength(50),
          isAlphanumericWithSpaces(),
        ])
      ),
    });
  }

  private setFormValues(): void {
    this.formGroup
      .get('modelo_formulario')
      ?.setValue(this.data.modelo_formulario);
    this.formGroup.get('nro_preg')?.setValue(this.data.nro_preg);
    this.formGroup
      .get('cantidad_lineas_resp')
      ?.setValue(this.data.cantidad_lineas_resp);
    this.formGroup.get('pide_fecha')?.setValue(this.data.pide_fecha);
    this.formGroup.get('yes_no')?.setValue(this.data.yes_no);
    this.formGroup
      .get('primer_texto_preg')
      ?.setValue(this.data.primer_texto_preg);
    this.formGroup
      .get('segundo_texto_preg')
      ?.setValue(this.data.segundo_texto_preg);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        modelo_formulario: this.formGroup.get('modelo_formulario')?.value,
        nro_preg: this.formGroup.get('nro_preg')?.value,
        cantidad_lineas_resp: this.formGroup.get('cantidad_lineas_resp')?.value,
        pide_fecha: this.formGroup.get('pide_fecha')?.value,
        yes_no: this.formGroup.get('yes_no')?.value,
        primer_texto_preg: this.formGroup.get('primer_texto_preg')?.value,
        segundo_texto_preg: this.formGroup.get('segundo_texto_preg')?.value,
      });
    }
  }

  getErrorMessage(control: any): string {
    if (control.errors?.['required']) {
      return `Campo requerido`;
    } else {
      if (control.errors?.['maxlength']) {
        return `No puede contener más de ${control.errors?.['maxlength'].requiredLength} caracteres`;
      }

      if (control.errors?.['minlength']) {
        return `Debe contener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
      }

      if (control.errors?.['notOnlySpacesValidator']) {
        return `No puede contener solo espacios`;
      }

      if (
        (control.errors?.['isAlphanumericWithSpaces'] ||
          control.errors?.['isAlphanumericWithSpaces']) &&
        control.value != '' &&
        control.value != null
      ) {
        return `No puede contener caracteres especiales`;
      }
    }
    return '';
  }
}
