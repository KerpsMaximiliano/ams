import { Component, Inject } from '@angular/core';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Validators
import {
  isAlphanumericWithSpaces,
  isNumeric,
  getErrorMessage,
} from 'src/app/core/validators/character.validator';

// * Componentes
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-condicion-iva-dialog',
  templateUrl: './add-edit-condicion-iva-dialog.component.html',
  styleUrls: ['./add-edit-condicion-iva-dialog.component.scss'],
})
export class AddEditCondicionIvaDialogComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.setUpForm();
    if (this.data.codigo_de_IVA !== undefined) {
      this.setFormValues();
    }
    if (!this.data.edit) {
      this.formGroup.disable();
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_de_IVA: new UntypedFormControl(
        { value: '', disabled: this.data.par_modo == 'U' },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric(),
        ])
      ),
      descripcion: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          isAlphanumericWithSpaces(),
        ])
      ),
      descripcion_reducida: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(8),
        ])
      ),
      formulario_AB: new UntypedFormControl(
        '',
        Validators.compose([Validators.required])
      ),
    });
  }

  private setFormValues(): void {
    // Codigo de iva
    this.formGroup.get('codigo_de_IVA')?.setValue(this.data.codigo_de_IVA);

    // Descripcion
    if (this.data.descripcion !== undefined) {
      this.formGroup.get('descripcion')?.setValue(this.data.descripcion);
    }

    // Descripcion reducida
    if (this.data.descripcion_reducida !== undefined) {
      this.formGroup
        .get('descripcion_reducida')
        ?.setValue(this.data.descripcion_reducida);
    }

    // Formulario A o B
    if (this.data.formulario_AB !== undefined) {
      this.formGroup.get('formulario_AB')?.setValue(this.data.formulario_AB);
    } else {
      this.formGroup.get('formulario_AB')?.setValue(null);
    }
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        codigo_de_IVA: this.formGroup.get('codigo_de_IVA')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        descripcion_reducida: this.formGroup.get('descripcion_reducida')?.value,
        formulario_AB: this.formGroup.get('formulario_AB')?.value,
      });
    }
  }
}
