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
  notOnlySpaces,
  notZeroValidator,
  getErrorMessage,
  isAlpha,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-obra-social-dialog',
  templateUrl: './add-edit-obra-social-dialog.component.html',
  styleUrls: ['./add-edit-obra-social-dialog.component.scss'],
})
export class AddEditObraSocialDialogComponent {
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
        codigo: this.formGroup.get('codigo')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        propone_fecha_patologia: this.formGroup.get('propone_fecha_patologia')
          ?.value,
        tipo_fecha_patologia: this.formGroup.get('tipo_fecha_patologia')?.value,
        tipo_obra_social_prepaga: this.formGroup.get('tipo_obra_social_prepaga')
          ?.value,
        nro_registro: this.formGroup.get('nro_registro')?.value,
        similar_SMP: this.formGroup.get('similar_SMP')?.value,
        omite_R420: this.formGroup.get('omite_R420')?.value,
      });
    }
  }

  public changeProponeFechaPatologia() {
    const proponeFechaPatologiaControl = this.formGroup.get(
      'propone_fecha_patologia'
    );
    const tipoFechaPatologiaControl = this.formGroup.get(
      'tipo_fecha_patologia'
    );
    if (proponeFechaPatologiaControl?.value === 'N') {
      tipoFechaPatologiaControl?.setValue('');
      tipoFechaPatologiaControl?.disable();
    } else {
      tipoFechaPatologiaControl?.enable();
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
          Validators.maxLength(5),
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
      propone_fecha_patologia: new UntypedFormControl(
        {
          value: this.data.propone_fecha_patologia
            ? this.data.propone_fecha_patologia.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      tipo_fecha_patologia: new UntypedFormControl(
        {
          value: this.data.tipo_fecha_patologia
            ? this.data.tipo_fecha_patologia.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isAlpha(),
        ])
      ),
      tipo_obra_social_prepaga: new UntypedFormControl(
        {
          value: this.data.tipo_obra_social_prepaga
            ? this.data.tipo_obra_social_prepaga.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      nro_registro: new UntypedFormControl(
        {
          value: this.data.nro_registro,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          notZeroValidator(),
          isNumeric(),
        ])
      ),
      similar_SMP: new UntypedFormControl(
        {
          value: this.data.similar_SMP ? this.data.similar_SMP.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      omite_R420: new UntypedFormControl(
        {
          value: this.data.omite_R420 ? this.data.omite_R420.trim() : '',
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
