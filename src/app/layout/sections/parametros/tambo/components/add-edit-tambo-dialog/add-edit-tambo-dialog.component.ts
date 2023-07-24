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
  isNumeric,
  getErrorMessage,
  notOnlySpaces,
  isAlpha,
  isDecimal,
  isNumberAndSymbol,
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
  public errorMessage: string;
  public setError: boolean;
  public maxLength: number;

  constructor(
    private dataSharingService: DataSharingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
    this.validate();
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

  public handleProvince(letra_provincia: string): string {
    const province = this.data.provincias.find(
      (provincia: IProvincia) => provincia.codigo == letra_provincia
    );
    return province ? province.nombre_provincia : '';
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      id_tambos: new UntypedFormControl(
        {
          value: this.data.id_tambos,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(5),
          isNumeric(),
        ])
      ),
      razon_social: new UntypedFormControl(
        {
          value: this.data.razon_social ? this.data.razon_social.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150),
          notOnlySpaces(),
        ])
      ),
      provincia: new UntypedFormControl(
        {
          value: this.data.provincia,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      localidad: new UntypedFormControl(
        {
          value: this.data.localidad ? this.data.localidad.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(22),
          notOnlySpaces(),
        ])
      ),
      grasa_ent: new UntypedFormControl(
        {
          value: this.data.grasa_ent ? this.data.grasa_ent : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([Validators.required, isNumberAndSymbol()])
      ),
    });
  }

  private validate(): void {
    this.formGroup.get('grasa_ent')?.valueChanges.subscribe((value: any) => {
      // const control = this.formGroup.get('grasa_ent')?.value;
      const regex =
        /^(?:\d{1,8}|\d{1,7},\d|\d{1,6},\d{2}|\d{5},\d{2}|\d{4},\d{2}|\d{3},\d{2}|\d{2},\d{2}|\d,\d{2}|\d{1,8},\d|\d{1,7},\d{2})$/;

      this.maxLength = value.includes(',') ? 9 : 8;

      if (regex.test(value)) {
        console.log('El valor cumple con las condiciones establecidas.');
        // Realizar acciones adicionales si el valor cumple con las condiciones establecidas.
      } else {
        console.log('El valor no cumple con las condiciones establecidas.');
        // Realizar acciones adicionales si el valor no cumple con las condiciones establecidas.
      }
    });
  }
}
