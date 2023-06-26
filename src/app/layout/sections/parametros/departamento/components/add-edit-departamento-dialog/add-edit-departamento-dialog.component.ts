import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import {
  getErrorMessage,
  notOnlySpaces,
  isNumeric,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-departamento-dialog',
  templateUrl: './add-edit-departamento-dialog.component.html',
  styleUrls: ['./add-edit-departamento-dialog.component.scss'],
})
export class AddEditDepartamentoDialogComponent {
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
        letra_provincia:
          this.data.par_modo === 'C'
            ? this.formGroup.get('nombre_provincia')?.value
            : this.data.letra_provincia,
        codigo_departamento: this.formGroup.get('codigo_departamento')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        descripcion_reducida: this.formGroup.get('descripcion_reducida')?.value,
      });
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      nombre_provincia: new UntypedFormControl(
        {
          value: this.handleProvince(this.data.letra_provincia),
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([Validators.required])
      ),
      codigo_departamento: new UntypedFormControl(
        {
          value: this.data.codigo_departamento,
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
          Validators.maxLength(50),
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
          Validators.minLength(3),
          Validators.maxLength(15),
          notOnlySpaces(),
        ])
      ),
    });
  }

  private handleProvince(letra_provincia: string): string {
    const province = this.data.provincias.find(
      (provincia: IProvincia) => provincia.codigo === letra_provincia
    );
    return province ? province.nombre_provincia : '';
  }
}
