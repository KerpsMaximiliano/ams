import { Component, Inject } from '@angular/core';
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
    (this.data.codigo_nacionalidad_nuevo)
      ? this.setFormValues()
      : this.formGroup.get('codigo_nacionalidad')?.setValue(0)
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_nacionalidad_nuevo: new UntypedFormControl({value:'', disabled: this.data.codigo_nacionalidad_nuevo},Validators.compose([
        Validators.maxLength(3),
        Validators.minLength(1),
        Validators.pattern("^[0-9]*$"),
      ])
    ),
      descripcion: new UntypedFormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          isAlphanumericWithSpaces
        ])
      ),
      codigo_nacionalidad: new UntypedFormControl({value: '', disabled: !this.data.codigo_nacionalidad_nuevo || this.data.codigo_nacionalidad == 0}, Validators.compose([
        Validators.maxLength(3),
        Validators.minLength(1),
        Validators.pattern("^[0-9]*$"),
        ])
      ),
    })
  }

  private setFormValues(): void {
    this.formGroup.get('codigo_nacionalidad_nuevo')?.setValue(this.data.codigo_nacionalidad_nuevo);
    this.formGroup.get('descripcion')?.setValue(this.data.descripcion);
    this.formGroup.get('codigo_nacionalidad')?.setValue(this.data.codigo_nacionalidad);    
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.data.codigo_nacionalidad 
        ? this.dialogRef.close({
            par_modo: 'U',
            id_tabla: 3,
            codigo_nacionalidad_nuevo: this.formGroup.get('codigo_nacionalidad_nuevo')?.value,
            descripcion: this.formGroup.get('descripcion')?.value,
            codigo_nacionalidad: this.formGroup.get('codigo_nacionalidad')?.value
        })
        : this.dialogRef.close({
          par_modo: 'I',
          id_tabla: 3,
          codigo_nacionalidad_nuevo: +this.formGroup.get('codigo_nacionalidad_nuevo')?.value,
          descripcion: this.formGroup.get('descripcion')?.value,
          codigo_nacionalidad: this.formGroup.get('codigo_nacionalidad')?.value
        });
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
      if (control.errors?.['pattern']) {
        return `No puede contener letras ni caracteres especiales`
      }
    }    
    return '';
  }
}
