import { Component, Inject } from '@angular/core';

// * Form
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import { isAlpha } from 'src/app/core/validators/character.validator';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-estado-civil-dialog',
  templateUrl: './add-edit-estado-civil-dialog.component.html',
  styleUrls: ['./add-edit-estado-civil-dialog.component.scss'],
})
export class AddEditEstadoCivilDialogComponent {
  public formGroup: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.setUpForm();
    if (this.data.codigo_estado_civil) this.setFormValues();
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_estado_civil: new UntypedFormControl(
        {
          value: this.data.codigo_estado_civil,
          disabled: this.data.par_modo == 'U',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      description: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          isAlpha(),
        ])
      ),
    });
  }

  private setFormValues(): void {
    this.formGroup
      .get('codigo_estado_civil')
      ?.setValue(this.data.codigo_estado_civil);
    this.formGroup.get('description')?.setValue(this.data.description);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        codigo_estado_civil: this.formGroup.get('codigo_estado_civil')?.value,
        description: this.formGroup.get('description')?.value,
      });
    }
  }

  getErrorMessage(control: any): string {
    if (control.errors?.['required']) {
      return `Campo requerido`;
    } else {
      if (control.errors?.['notAlpha']) {
        return `Solo se aceptan letras`;
      }

      if (control.errors?.['maxlength']) {
        return `No puede contener más de ${control.errors?.['maxlength'].requiredLength} caracteres`;
      }

      if (control.errors?.['minlength']) {
        return `Debe contener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }
}
