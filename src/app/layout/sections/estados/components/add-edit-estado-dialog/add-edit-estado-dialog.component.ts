import { Component, Inject, Input } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isAlphanumericWithSpaces } from 'src/app/core/validators/character.validator';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-estado-dialog',
  templateUrl: './add-edit-estado-dialog.component.html',
  styleUrls: ['./add-edit-estado-dialog.component.scss']
})
export class AddEditEstadoDialogComponent {

  public formGroup: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.setUpForm();

    if (this.data.id) this.setFormValues();
  }

  private setUpForm():void {
    this.formGroup = new UntypedFormGroup({
      descripcion: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        isAlphanumericWithSpaces()
      ])
    )})
  }

  private setFormValues() {
    this.formGroup.get('descripcion')?.setValue(this.data.descripcion);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void{
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.data.id ? this.dialogRef.close({id: this.data.id, descripcion: this.formGroup.get('descripcion')?.value})
                   : this.dialogRef.close(this.formGroup.get('descripcion')?.value);
    }
  }

  getErrorMessage(control: any) {
    if (control.errors?.['required']) {
      return `Campo requerido`
    } else {
      if (control.errors?.['maxlength']) {
        return `Descripción no puede contener más de ${control.errors?.['maxlength'].requiredLength} caracteres`
      }

      if (control.errors?.['minlength']) {
        return `Descripción debe contener al menos ${control.errors?.['minlength'].requiredLength} caracteres`
      }

      if ((control.errors?.['notAlphanumeric'] || control.errors?.['notAlphanumericWithSpaces']) && control.value != '' && control.value != null) {
        return `Descripción no puede contener caracteres especiales`
      }
    }    

    return '';
  }

}
