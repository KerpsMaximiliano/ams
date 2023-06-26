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
  getErrorMessage,
  notOnlySpaces,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-condicion-iva-dialog',
  templateUrl: './add-edit-condicion-iva-dialog.component.html',
  styleUrls: ['./add-edit-condicion-iva-dialog.component.scss'],
})
export class AddEditCondicionIvaDialogComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;

  constructor(
    private dataSharingService: DataSharingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        codigo_de_IVA: this.formGroup.get('codigo_de_IVA')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        descripcion_reducida: this.formGroup.get('descripcion_reducida')?.value,
        formulario_AB: this.formGroup.get('formulario_AB')?.value,
      });
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_de_IVA: new UntypedFormControl(
        {
          value: this.data.codigo_de_IVA,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
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
          Validators.maxLength(20),
          notOnlySpaces(),
        ])
      ),
      descripcion_reducida: new UntypedFormControl(
        {
          value: this.data.descripcion_reducida
            ? this.data.descripcion_reducida.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(8),
          notOnlySpaces(),
        ])
      ),
      formulario_AB: new UntypedFormControl(
        {
          value: this.data.formulario_AB,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ])
      ),
    });
  }
}
