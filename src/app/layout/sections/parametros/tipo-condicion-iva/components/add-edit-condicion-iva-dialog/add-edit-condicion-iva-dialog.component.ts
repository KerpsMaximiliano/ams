import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isAlphanumericWithSpaces } from 'src/app/core/validators/character.validator';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-condicion-iva-dialog',
  templateUrl: './add-edit-condicion-iva-dialog.component.html',
  styleUrls: ['./add-edit-condicion-iva-dialog.component.scss']
})
export class AddEditCondicionIvaDialogComponent {

  public formGroup: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.setUpForm();
    if (this.data.id) this.setFormValues();
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      condicion: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        isAlphanumericWithSpaces()
      ])),
      abreviatura: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(3),
        isAlphanumericWithSpaces()
      ])),
      formulario: new UntypedFormControl({value: 'A', disabled: !this.data.edit}, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
      ]))
    })
  }

  private setFormValues(): void {
    this.formGroup.get('condicion')?.setValue(this.data.condicion);
    this.formGroup.get('abreviatura')?.setValue(this.data.abreviatura);
    (this.data.cuit)
      ? this.formGroup.get('formulario')?.setValue(this.data.cuit)
      : this.formGroup.get('formulario')?.setValue('A');
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      (this.data.id != 99)
        ? this.dialogRef.close({par_modo: 'U', id: this.data.id, descripcion: this.formGroup.get('condicion')?.value, descripcion_reducida: this.formGroup.get('abreviatura')?.value, control_cuit: this.formGroup.get('formulario')?.value, tipo_de_documento: this.data.tipo_documento})
        : this.dialogRef.close({par_modo: 'I', id: this.data.id, descripcion: this.formGroup.get('condicion')?.value, descripcion_reducida: this.formGroup.get('abreviatura')?.value, control_cuit: this.formGroup.get('formulario')?.value, tipo_de_documento: 3});
    }
  }

  getErrorMessage(control: any): string {
    if (control.errors?.['required']) {
      return `Campo requerido`
    } else {
      if (control.errors?.['maxlength']) {
        return `No puede contener más de ${control.errors?.['maxlength'].requiredLength} caracteres`
      }

      if (control.errors?.['minlength']) {
        return `Debe contener al menos ${control.errors?.['minlength'].requiredLength} caracteres`
      }

      if ((control.errors?.['notAlphanumeric'] || control.errors?.['notAlphanumericWithSpaces']) && control.value != '' && control.value != null) {
        return `No puede contener caracteres especiales`
      }
    }
    return '';
  }
}
