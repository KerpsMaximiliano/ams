import { Component, Inject } from '@angular/core';

// * Form - Validations
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  isNumeric,
  notZeroValidator,
} from 'src/app/core/validators/character.validator';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-edit-preguntas-ddjj-dialog',
  templateUrl: './add-edit-atributos-relacion-capita-plan-dialog.component.html',
  styleUrls: ['./add-edit-atributos-relacion-capita-plan-dialog.component.scss'],
})
export class AddEditAtributosRelacionCapitaPlanDialogComponent {
  public formGroup: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.setUpForm();
    if (this.data.nro_preg !== undefined) {
      if (this.data.nro_preg > 0) {
        this.formGroup.get('nro_preg')?.setValue(this.data.nro_preg);
        this.setFormValues();
        if (this.data.par_modo === 'C' && this.data.edit !== true) {
          this.formGroup.disable();
        }
      } else {
        this.formGroup.get('nro_preg')?.setValue(0);
      }
      this.formGroup.get('nro_preg')?.disable();
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      modelo_formulario: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),

      nro_preg: new UntypedFormControl(''),

      cantidad_lineas_resp: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          notZeroValidator(),
          isNumeric(),
        ])
      ),

      pide_fecha: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),
      yes_no: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),

      primer_texto_preg: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ])
      ),

      segundo_texto_preg: new UntypedFormControl(
        '',
        Validators.compose([Validators.maxLength(50)])
      ),
    });
  }

  private exclusiveSelects(): string {
    return `No pueden ser iguales.`;
  }

  private setFormValues(): void {
    if (this.data.modelo_formulario !== undefined) {
      this.formGroup.patchValue({
        modelo_formulario: this.data.modelo_formulario.trim(),
      });
      if (this.data.nro_preg > 0 && this.data.par_modo === 'U') {
        this.formGroup.get('modelo_formulario')?.disable();
      }
    }

    if (this.data.cantidad_lineas_resp !== undefined) {
      this.formGroup
        .get('cantidad_lineas_resp')
        ?.setValue(this.data.cantidad_lineas_resp);
    }

    if (this.data.pide_fecha !== undefined) {
      this.formGroup.patchValue({
        pide_fecha: this.data.pide_fecha,
      });
    }

    if (this.data.yes_no !== undefined) {
      this.formGroup.patchValue({
        yes_no: this.data.yes_no,
      });
    }

    if (this.data.primer_texto_preg !== undefined) {
      this.formGroup
        .get('primer_texto_preg')
        ?.setValue(this.data.primer_texto_preg);
    }

    if (this.data.segundo_texto_preg !== undefined) {
      this.formGroup
        .get('segundo_texto_preg')
        ?.setValue(this.data.segundo_texto_preg);
    }
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
      if (control.errors?.['notNumeric']) {
        return `Solo puede contener numeros.`;
      }
      if (control.errors?.['notZero']) {
        return `No puede ser cero.`;
      }
    }
    return '';
  }
}
