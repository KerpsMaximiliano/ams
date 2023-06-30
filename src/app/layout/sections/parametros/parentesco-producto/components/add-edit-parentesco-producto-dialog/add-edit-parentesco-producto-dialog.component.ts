import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';

// * Interfaces
import { IParentesco } from 'src/app/core/models/parentesco-producto.interface';

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
  selector: 'app-add-edit-parentesco-producto-dialog',
  templateUrl: './add-edit-parentesco-producto-dialog.component.html',
  styleUrls: ['./add-edit-parentesco-producto-dialog.component.scss'],
})
export class AddEditParentescoProductoDialogComponent {
  public getErrorMessage = getErrorMessage;
  public formGroup: UntypedFormGroup;
  selectedItem: IParentesco;

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
        producto: this.data.producto.codigo_producto,
        descripcion: this.formGroup.get('descripcion')?.value,
        codigo_parentesco: this.formGroup.get('codigo_parentesco')?.value,
        permite_darse_baja: this.formGroup.get('permite_darse_baja')?.value,
        pide_fecha_enlace: this.formGroup.get('pide_fecha_enlace')?.value,
        codigo_afip:
          this.data.par_modo === 'C'
            ? this.formGroup.get('codigo_afip')?.value.codigo
            : this.data.codigo_parentesco_afip,
      });
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_parentesco: new UntypedFormControl(
        {
          value: this.data.codigo_parentesco,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric(),
          notZeroValidator(),
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
      permite_darse_baja: new UntypedFormControl(
        {
          value: this.data.permite_darse_baja,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([Validators.required])
      ),
      pide_fecha_enlace: new UntypedFormControl(
        {
          value: this.data.pide_fecha_enlace,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([Validators.required])
      ),
      codigo_afip: new UntypedFormControl(
        {
          value:
            this.data.codigo_parentesco_afip < 10
              ? this.data.parentescos[this.data.codigo_parentesco_afip]
                  .descripcion
              : this.data.codigo_parentesco_afip,
          disabled: this.data.par_modo !== 'C',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
    });
  }
}
