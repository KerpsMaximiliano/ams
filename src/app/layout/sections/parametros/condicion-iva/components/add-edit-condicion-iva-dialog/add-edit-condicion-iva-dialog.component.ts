import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isAlphanumericWithSpaces, isNumeric } from 'src/app/core/validators/character.validator';
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
    if (this.data.id){
     this.setFormValues();
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_de_IVA: new UntypedFormControl({value: this.data.codigo_de_IVA, disabled: this.data.par_modo == 'U'},Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
        isNumeric()
      ])),
      descripcion: new UntypedFormControl(this.data.descripcion, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        isAlphanumericWithSpaces()
      ])),

      descripcion_reducida: new UntypedFormControl(this.data.descripcion_reducida, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(8),
      ])),
      formulario_AB: new UntypedFormControl({value: this.data.formulario_AB, disabled: !this.data.edit}, Validators.compose([
        Validators.required
      ]))
    })
  }

  private setFormValues(): void {
    this.formGroup.get('codigo_de_IVA')?.setValue(this.data.codigo_de_IVA);
    this.formGroup.get('descripcion')?.setValue(this.data.descripcion);
    this.formGroup.get('descripcion_reducida')?.setValue(this.data.descripcion_reducida);
    (this.data.formulario_AB)
      ? this.formGroup.get('formulario_AB')?.setValue(this.data.formulario_AB)
      : this.formGroup.get('formulario_AB')?.setValue('');
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
        this.dialogRef.close({par_modo: this.data.par_modo, codigo_de_IVA: this.formGroup.get('codigo_de_IVA')?.value, descripcion: this.formGroup.get('descripcion')?.value, descripcion_reducida: this.formGroup.get('descripcion_reducida')?.value, formulario_AB: this.formGroup.get('formulario_AB')?.value})
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

      if (control.errors?.['notNumeric']) {
        return `Solo debe contener numeros`
      }

      if ((control.errors?.['notAlphanumeric'] || control.errors?.['notAlphanumericWithSpaces']) && control.value != '' && control.value != null) {
        return `No puede contener caracteres especiales`
      }
    }
    return '';
  }
}
