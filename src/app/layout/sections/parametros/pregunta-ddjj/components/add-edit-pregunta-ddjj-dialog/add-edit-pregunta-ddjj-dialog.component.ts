import { Component, Inject } from '@angular/core';

// * Form - Validations
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  isNumeric,
  notOnlySpaces,
  notZeroValidator,
  getErrorMessage,
} from 'src/app/core/validators/character.validator';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-pregunta-ddjj-dialog',
  templateUrl: './add-edit-pregunta-ddjj-dialog.component.html',
  styleUrls: ['./add-edit-pregunta-ddjj-dialog.component.scss'],
})
export class AddEditPreguntaDDJJDialogComponent {
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
   *     > Habilitada: deshabilita el 'nro_preg'.
   */
  ngOnInit(): void {
    this.setUpForm();
    if (this.data.par_modo === 'U' || this.data.par_modo === 'R') {
      this.setFormValues();
      if (this.data.edit === false) {
        this.formGroup.disable();
      } else {
        this.formGroup.get('nro_preg')?.disable();
      }
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      modelo_formulario: new UntypedFormControl(
        this.data.modelo_formulario,
        Validators.compose([Validators.required])
      ),

      nro_preg: new UntypedFormControl(
        this.data.nro_preg,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric(),
        ])
      ),
      cantidad_lineas_resp: new UntypedFormControl(
        this.data.cantidad_lineas_resp,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isNumeric(),
          notZeroValidator(),
        ])
      ),
      pide_fecha: new UntypedFormControl(
        this.data.pide_fecha,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ])
      ),
      yes_no: new UntypedFormControl(
        this.data.yes_no,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ])
      ),
      primer_texto_preg: new UntypedFormControl(
        this.data.primer_texto_preg ? this.data.primer_texto_preg.trim() : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          notOnlySpaces(),
        ])
      ),
      segundo_texto_preg: new UntypedFormControl(
        this.data.segundo_texto_preg ? this.data.segundo_texto_preg.trim() : '',
        Validators.compose([Validators.maxLength(50), notOnlySpaces()])
      ),
    });
  }

  private setFormValues(): void {
    this.formGroup.patchValue({
      modelo_formulario: this.data.modelo_formulario
        ? this.data.modelo_formulario.trim()
        : '',
    });

    this.formGroup
      .get('cantidad_lineas_resp')
      ?.setValue(this.data.cantidad_lineas_resp);

    this.formGroup.patchValue({
      pide_fecha: this.data.pide_fecha,
    });

    this.formGroup.patchValue({
      yes_no: this.data.yes_no,
    });

    this.formGroup
      .get('primer_texto_preg')
      ?.setValue(
        this.data.primer_texto_preg ? this.data.primer_texto_preg.trim() : ''
      );

    this.formGroup
      .get('segundo_texto_preg')
      ?.setValue(
        this.data.segundo_texto_preg ? this.data.segundo_texto_preg.trim() : ''
      );
  }

  public closeDialog(): void {
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

  public onChangeDate() {
    if (this.formGroup.get('pide_fecha')?.value === 'S') {
      this.formGroup.get('yes_no')?.setValue('N');
    }
  }

  public onChangeYesNo() {
    if (this.formGroup.get('yes_no')?.value === 'S') {
      this.formGroup.get('pide_fecha')?.setValue('N');
    }
  }
}
