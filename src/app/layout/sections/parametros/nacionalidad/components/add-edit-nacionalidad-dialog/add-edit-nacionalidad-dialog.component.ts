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
  getErrorMessage,
  isNumeric,
  notOnlySpaces,
  notZeroValidator,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-nacionalidad-dialog',
  templateUrl: './add-edit-nacionalidad-dialog.component.html',
  styleUrls: ['./add-edit-nacionalidad-dialog.component.scss'],
})
export class AddEditNacionalidadDialogComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataSharingService: DataSharingService
  ) {
    this.setUpForm();
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
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

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_nacionalidad_nuevo: new UntypedFormControl(
        {
          value: this.data.codigo_nacionalidad_nuevo,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          isNumeric(),
        ])
      ),
      descripcion: new UntypedFormControl(
        {
          value: this.data.descripcion ? this.data.descripcion.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      codigo_sistema_anterior: new UntypedFormControl(
        {
          value: this.data.codigo_sistema_anterior,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          notZeroValidator(),
          isNumeric(),
        ])
      ),
    });
  }
}
