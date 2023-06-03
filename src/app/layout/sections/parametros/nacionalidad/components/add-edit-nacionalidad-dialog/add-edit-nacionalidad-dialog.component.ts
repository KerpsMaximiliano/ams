import { Component, Inject } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import { isAlphanumericWithSpaces } from 'src/app/core/validators/character.validator';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-nacionalidad-dialog',
  templateUrl: './add-edit-nacionalidad-dialog.component.html',
  styleUrls: ['./add-edit-nacionalidad-dialog.component.scss'],
})
export class AddEditNacionalidadDialogComponent {
  public formGroup: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.setUpForm();
    if (this.data.codigo_nacionalidad_nuevo) this.setFormValues();
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_nacionalidad_nuevo: new UntypedFormControl(
        {
          value: '',
          disabled:
            this.data.codigo_nacionalidad_nuevo &&
            this.data.title === 'EDITAR NACIONALIDAD',
        },
        Validators.compose([
          Validators.maxLength(3),
          Validators.minLength(1),
          Validators.pattern('^[0-9]*$'),
        ])
      ),
      descripcion: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          isAlphanumericWithSpaces,
        ])
      ),
      codigo_sistema_anterior: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.maxLength(3),
          Validators.minLength(1),
          Validators.pattern('^[0-9]*$'),
        ])
      ),
    });
  }

  private setFormValues(): void {
    this.formGroup
      .get('codigo_nacionalidad_nuevo')
      ?.setValue(this.data.codigo_nacionalidad_nuevo);
    this.formGroup.get('descripcion')?.setValue(this.data.descripcion);
    this.formGroup
      .get('codigo_sistema_anterior')
      ?.setValue(this.data.codigo_sistema_anterior);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.data.codigo_nacionalidad_nuevo
        ? this.dialogRef.close({
            par_modo: 'U',
            codigo_nacionalidad_nuevo: this.formGroup.get(
              'codigo_nacionalidad_nuevo'
            )?.value,
            descripcion: this.formGroup.get('descripcion')?.value,
            codigo_sistema_anterior: this.formGroup.get(
              'codigo_sistema_anterior'
            )?.value,
          })
        : this.dialogRef.close({
            par_modo: 'I',
            codigo_nacionalidad_nuevo: +this.formGroup.get(
              'codigo_nacionalidad_nuevo'
            )?.value,
            descripcion: this.formGroup.get('descripcion')?.value,
            codigo_sistema_anterior: this.formGroup.get(
              'codigo_sistema_anterior'
            )?.value,
          });
    }
  }

  getErrorMessage(control: any) {
    if (control.errors?.['required']) {
      return `Campo requerido`;
    } else {
      if (control.errors?.['maxlength']) {
        return `No puede contener más de ${control.errors?.['maxlength'].requiredLength} caracteres`;
      }
      if (control.errors?.['minlength']) {
        return `Debe contener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
      }
      if (
        (control.errors?.['notAlphanumeric'] ||
          control.errors?.['notAlphanumericWithSpaces']) &&
        control.value != '' &&
        control.value != null
      ) {
        return `No puede contener caracteres especiales`;
      }
      if (control.errors?.['pattern']) {
        return `No puede contener letras, caracteres especiales`;
      }
    }
    return '';
  }
}
