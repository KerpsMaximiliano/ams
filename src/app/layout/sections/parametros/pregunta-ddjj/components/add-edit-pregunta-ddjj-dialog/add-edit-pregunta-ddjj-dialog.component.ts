import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validators
import {
  isNumeric,
  notOnlySpaces,
  notZeroValidator,
  getErrorMessage,
  isAlpha,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-pregunta-ddjj-dialog',
  templateUrl: './add-edit-pregunta-ddjj-dialog.component.html',
  styleUrls: ['./add-edit-pregunta-ddjj-dialog.component.scss'],
})
export class AddEditPreguntaDDJJDialogComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataSharingService: DataSharingService
  ) {
    this.setUpForm();
  }

  public confirm(): void {
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        modelo_formulario: this.formGroup.get('modelo_formulario')?.value,
        nro_preg: this.formGroup.get('nro_preg')?.value,
        cantidad_lineas_resp: this.formGroup.get('cantidad_lineas_resp')?.value,
        pide_fecha: this.formGroup.get('pide_fecha')?.value,
        yes_no: this.formGroup.get('yes_no')?.value,
        primer_texto_preg: this.formGroup.get('primer_texto_preg')?.value,
        segundo_texto_preg: this.formGroup.get('segundo_texto_preg')?.value,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public changeOption() {
    if (this.formGroup.get('pide_fecha')?.value === 'S') {
      this.formGroup.get('yes_no')?.setValue('N');
    }
    if (this.formGroup.get('yes_no')?.value === 'S') {
      this.formGroup.get('pide_fecha')?.setValue('N');
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      modelo_formulario: new UntypedFormControl(
        {
          value: this.data.modelo_formulario
            ? this.data.modelo_formulario.trim()
            : '',
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
        ])
      ),
      nro_preg: new UntypedFormControl(
        {
          value: this.data.nro_preg,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric(),
        ])
      ),
      cantidad_lineas_resp: new UntypedFormControl(
        {
          value: this.data.cantidad_lineas_resp,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isNumeric(),
          notZeroValidator(),
        ])
      ),
      pide_fecha: new UntypedFormControl(
        {
          value: this.data.pide_fecha,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      yes_no: new UntypedFormControl(
        {
          value: this.data.yes_no,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      primer_texto_preg: new UntypedFormControl(
        {
          value: this.data.primer_texto_preg
            ? this.data.primer_texto_preg.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          notOnlySpaces(),
        ])
      ),
      segundo_texto_preg: new UntypedFormControl(
        {
          value: this.data.segundo_texto_preg
            ? this.data.segundo_texto_preg.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([Validators.maxLength(50), notOnlySpaces()])
      ),
    });
  }
}
