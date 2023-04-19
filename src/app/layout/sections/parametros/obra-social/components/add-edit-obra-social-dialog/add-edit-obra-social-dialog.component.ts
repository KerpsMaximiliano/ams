import { Component, Inject } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  isAlphanumericWithPointAndSpaces,
  isNumeric,
  notZeroValidator,
} from 'src/app/core/validators/character.validator';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-obra-social-dialog',
  templateUrl: './add-edit-obra-social-dialog.component.html',
  styleUrls: ['./add-edit-obra-social-dialog.component.scss'],
})
export class AddEditObraSocialDialogComponent {
  public formGroup: UntypedFormGroup = new UntypedFormGroup({});

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.setUpForm();
    if (this.data.id) {
      this.setFormValues();
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo: new UntypedFormControl(
        { value: this.data.codigo, disabled: this.data.par_modo == 'U' },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(5),
          isNumeric(),
        ])
      ),
      descripcion: new UntypedFormControl(
        this.data.descripcion,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          isAlphanumericWithPointAndSpaces(),
        ])
      ),
      proponeFechaPatologia: new UntypedFormControl(
        { value: this.data.propone_fecha_patologia, disabled: !this.data.edit },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
      tipoFechaPatologia: new UntypedFormControl(
        { value: this.data.tipo_fecha_patologia, disabled: !this.data.edit },
        Validators.compose([Validators.minLength(1), Validators.maxLength(2)])
      ),
      tipo: new UntypedFormControl(
        {
          value: this.data.tipo_obra_social_prepaga,
          disabled: !this.data.edit,
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
      numeroRegistroNacional: new UntypedFormControl(this.data.nro_registro, Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
          notZeroValidator()
        ]),
      ),
      similar_SMP: new UntypedFormControl(
        { value: this.data.similar_SMP, disabled: !this.data.edit },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
      omite_R420: new UntypedFormControl(
        { value: this.data.omite_R420, disabled: !this.data.edit },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
    });
  }

  private setFormValues(): void {
    console.log(this.formGroup);
    this.formGroup.get('codigo')?.setValue(this.data.codigo);
    this.formGroup.get('descripcion')?.setValue(this.data.descripcion);

    this.data.proponeFechaPatologia
      ? this.formGroup
          .get('proponeFechaPatologia')
          ?.setValue(this.data.proponeFechaPatologia)
      : this.formGroup.get('proponeFechaPatologia')?.setValue('');

    this.data.tipoFechaPatologia
      ? this.formGroup
          .get('tipoFechaPatologia')
          ?.setValue(this.data.tipoFechaPatologia)
      : this.formGroup.get('tipoFechaPatologia')?.setValue('');

    this.formGroup.get('tipo')?.setValue(this.data.tipo);
    this.formGroup
      .get('numeroRegistroNacional')
      ?.setValue(this.data.numeroRegistroNacional);

    this.data.similar_SMP
      ? this.formGroup.get('similar_SMP')?.setValue(this.data.similar_SMP)
      : this.formGroup.get('similar_SMP')?.setValue('');

    this.data.omiteResolucion
      ? this.formGroup.get('omite_R420')?.setValue(this.data.omite_R420)
      : this.formGroup.get('omite_R420')?.setValue('');
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        codigo: this.formGroup.get('codigo')?.value,
        descripcion: this.formGroup.get('descripcion')?.value.trim(),
        propone_fecha_patologia: this.formGroup.get('proponeFechaPatologia')
          ?.value,
        tipo_fecha_patologia: this.formGroup.get('tipoFechaPatologia')?.value,
        tipo_obra_social_prepaga: this.formGroup.get('tipo')?.value,
        nro_registro: this.formGroup.get('numeroRegistroNacional')?.value,
        similar_SMP: this.formGroup.get('similar_SMP')?.value,
        omite_R420: this.formGroup.get('omite_R420')?.value,
      });
    }
  }

  getErrorMessage(control: any): string {
    if (control.errors?.['required']) {
      return `Campo requerido`;
    } else {
      if (control.errors?.['maxlength']) {
        return `No puede contener más de ${control.errors?.['maxlength'].requiredLength} caracteres`;
      }

      if (control.errors?.['minlength']) {
        return `Debe contener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
      }

      if (control.errors?.['notZero']) {
        return `No puede ser 0`;
      }

      if (
        control.errors?.['notAlphanumericWithPointAndSpaces'] &&
        control.value != '' &&
        control.value != null
      ) {
        return `No puede contener caracteres especiales`;
      }
    }
    return '';
  }

  changeProponeFechaPatologia() {
    const proponeFechaPatologiaControl = this.formGroup.get(
      'proponeFechaPatologia'
    );
    const tipoFechaPatologiaControl = this.formGroup.get('tipoFechaPatologia');
    if (proponeFechaPatologiaControl?.value === 'N') {
      tipoFechaPatologiaControl?.setValue('');
      tipoFechaPatologiaControl?.disable();
    } else {
      tipoFechaPatologiaControl?.enable();
    }
  }
}
