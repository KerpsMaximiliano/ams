import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isAlphanumericWithSpaces } from 'src/app/core/validators/character.validator';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-obra-social-dialog',
  templateUrl: './add-edit-obra-social-dialog.component.html',
  styleUrls: ['./add-edit-obra-social-dialog.component.scss']
})
export class AddEditObraSocialDialogComponent {

  public formGroup: UntypedFormGroup =  new UntypedFormGroup({});

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.setUpForm();
    if (this.data.id) this.setFormValues();
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      obraSocial: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20), 
        isAlphanumericWithSpaces()
      ])),
      proponeFechaPatologia: new UntypedFormControl({value: 'S', disabled: !this.data.edit}, Validators.compose([
        Validators.required,
        Validators.minLength(1), // Necesario?
        Validators.maxLength(2), // Necesario?
      ])),
      tipoFechaPatologia: new UntypedFormControl({value: '', disabled: !this.data.edit}, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
      ])),
      tipo: new UntypedFormControl({value: 'O', disabled: !this.data.edit}, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
      ])),
      numeroRegistroNacional: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
        isAlphanumericWithSpaces()
      ])),
      similarSMP: new UntypedFormControl({value: 'S', disabled: !this.data.edit}, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
      ])),
      omiteResolucion: new UntypedFormControl({value: 'S', disabled: !this.data.edit}, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
      ])),
    })
  }

  private setFormValues(): void {
    this.formGroup.get('obraSocial')?.setValue(this.data.tipo);
    (this.data.proponeFechaPatologia)
      ? this.formGroup.get('proponeFechaPatologia')?.setValue(this.data.proponeFechaPatologia)
      : this.formGroup.get('proponeFechaPatologia')?.setValue('N');
    this.formGroup.get('tipoFechaPatologia')?.setValue(this.data.tipoFechaPatologia);
    this.formGroup.get('tipo')?.setValue(this.data.tipo);
    this.formGroup.get('numeroRegistroNacional')?.setValue(this.data.numeroRegistroNacional);
    
    (this.data.similarSMP)
      ? this.formGroup.get('similarSMP')?.setValue(this.data.similarSMP)
      : this.formGroup.get('similarSMP')?.setValue('N');
      
    (this.data.similarSMP)
    ? this.formGroup.get('similarSMP')?.setValue(this.data.similarSMP)
    : this.formGroup.get('similarSMP')?.setValue('N');
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  // MODIFICAR
  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      (this.data.id != 99)
        ? this.dialogRef.close({par_modo: 'U', id: this.data.id, descripcion: this.formGroup.get('obra-social')?.value, formulario: this.formGroup.get('tipo')?.value, control_cuit: this.formGroup.get('formulario')?.value, tipo_de_documento: this.data.tipo_documento})
        : this.dialogRef.close({par_modo: 'I', id: this.data.id, descripcion: this.formGroup.get('obra-social')?.value, formulario: this.formGroup.get('tipo')?.value, control_cuit: this.formGroup.get('formulario')?.value, tipo_de_documento: 3});
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
