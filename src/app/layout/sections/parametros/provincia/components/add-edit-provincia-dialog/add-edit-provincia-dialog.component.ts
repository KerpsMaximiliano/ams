import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import {
  isAlpha,
  isNumeric,
  notOnlySpaces,
  getErrorMessage,
  isDecimal,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-provincia-dialog',
  templateUrl: './add-edit-provincia-dialog.component.html',
  styleUrls: ['./add-edit-provincia-dialog.component.scss'],
})
export class AddEditProvinciaDialogComponent {
  public getErrorMessage = getErrorMessage;
  public formGroup: UntypedFormGroup;

  constructor(
    private dataSharingService: DataSharingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
  }

  public confirm(): void {
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        codigo: this.formGroup.get('codigo')?.value,
        nombre_provincia: this.formGroup.get('nombre_provincia')?.value,
        codifica_altura: this.formGroup.get('codifica_altura')?.value,
        codigo_provincia: this.formGroup.get('codigo_provincia')?.value,
        flete_transportista: this.formGroup.get('flete_transportista')?.value,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo: new UntypedFormControl(
        {
          value: this.data.codigo,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      nombre_provincia: new UntypedFormControl(
        {
          value: this.data.nombre_provincia
            ? this.data.nombre_provincia.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      codigo_provincia: new UntypedFormControl(
        {
          value: this.data.codigo_provincia,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric(),
        ])
      ),
      codifica_altura: new UntypedFormControl(
        {
          value: this.data.codifica_altura,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      flete_transportista: new UntypedFormControl(
        {
          value: this.data.flete_transportista,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(7),
          isDecimal(),
        ])
      ),
    });
  }
}
