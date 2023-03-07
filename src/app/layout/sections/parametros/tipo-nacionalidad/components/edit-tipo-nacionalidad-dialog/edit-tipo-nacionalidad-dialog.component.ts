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
    console.log(this.formGroup);

    if (this.data.codigo_nacionalidad) this.setFormValues();
  }

  private setUpForm():void {
    this.formGroup = new UntypedFormGroup({
      par_modo: new UntypedFormControl(''),
      id_tabla: new UntypedFormControl(''),
      codigo_nacionalidad: new UntypedFormControl('',Validators.compose([
        Validators.maxLength(3)
      ])
    ),
      descripcion: new UntypedFormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ])
      ),
      codigo_sistema_anterior: new UntypedFormControl('', Validators.compose([
          Validators.maxLength(3)
        ])
      ),
    })
  }

  private setFormValues() {
    this.formGroup.get('par_modo')?.setValue('U');
    this.formGroup.get('id_tabla')?.setValue(this.data.id_tabla);
    this.formGroup.get('codigo_nacionalidad')?.setValue(this.data.codigo_nacionalidad);
    this.formGroup.get('descripcion')?.setValue(this.data.descripcion);
    this.formGroup.get('codigo_sistema_anterior')?.setValue(this.data.codigo_sistema_anterior);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void{
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.data.codigo_nacionalidad ? this.dialogRef.close({
          par_modo: this.formGroup.get('par_modo')?.value,
          id_tabla: this.formGroup.get('id_tabla')?.value,
          codigo_nacionalidad: this.formGroup.get('codigo_nacionalidad')?.value,
          descripcion: this.formGroup.get('descripcion')?.value,
          codigo_sistema_anterior: this.formGroup.get('codigo_sistema_anterior')?.value})
        : this.dialogRef.close(this.formGroup.get('descripcion')?.value);
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
