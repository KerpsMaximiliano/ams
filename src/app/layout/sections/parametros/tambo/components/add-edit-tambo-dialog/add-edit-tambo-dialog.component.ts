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
  isNumeric,
  getErrorMessage,
  notOnlySpaces,
  isAlpha,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-tambo-dialog',
  templateUrl: './add-edit-tambo-dialog.component.html',
  styleUrls: ['./add-edit-tambo-dialog.component.scss'],
})
export class AddEditTamboDialogComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;

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
        tipo_de_documento: this.formGroup.get('tipo_de_documento')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        descripcion_reducida: this.formGroup.get('descripcion_reducida')?.value,
        control_cuit: this.formGroup.get('control_cuit')?.value,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      tipo_de_documento: new UntypedFormControl(
        {
          value: this.data.tipo_de_documento,
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
          Validators.maxLength(3),
          notOnlySpaces(),
        ])
      ),
      control_cuit: new UntypedFormControl(
        {
          value: this.data.control_cuit ? this.data.control_cuit.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
    });
  }
}
