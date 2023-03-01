import { Component, Inject, Input } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isAlphanumericWithSpaces } from 'src/app/core/validators/character.validator';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-tipo-nacionalidad-dialog',
  templateUrl: './edit-tipo-nacionalidad-dialog.component.html',
  styleUrls: ['./edit-tipo-nacionalidad-dialog.component.scss']
})
export class EditTipoNacionalidadDialogComponent {

  public formGroup: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.setUpForm();

    if (this.data.id) this.setFormValues();
  }

  private setUpForm():void {
    this.formGroup = new UntypedFormGroup({
      Nacionalidad: new UntypedFormControl(''//, Validators.compose([
      //   Validators.required,
      //   Validators.minLength(3),
      //   Validators.maxLength(20),
      // ])
      ),
      NacionalidadAnterior: new UntypedFormControl(''//, Validators.compose([
      //   Validators.required,
      //   Validators.minLength(1),
      //   Validators.maxLength(3),
      // ])
      ),
    })
  }

  private setFormValues() {
    this.formGroup.get('Nacionalidad')?.setValue(this.data.nacionalidad);
    this.formGroup.get('NacionalidadAnterior')?.setValue(this.data.nacionalidadAnterior);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void{
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.data.id ? this.dialogRef.close({id: this.data.id
                  , Nacionalidad: this.formGroup.get('Nacionalidad')?.value
                  , NacionalidadAnterior: this.formGroup.get('NacionalidadAnterior')?.value})
                  : this.dialogRef.close(this.formGroup.get('Nacionalidad')?.value)
                  , this.dialogRef.close(this.formGroup.get('NacionalidadAnterior')?.value);
    }
  }

  getErrorMessage(control: any) {
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
