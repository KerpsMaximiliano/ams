import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isAlphanumeric, isAlphanumericWithSpaces, isNumeric } from 'src/app/core/validators/character.validator';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-provincia-dialog',
  templateUrl: './add-edit-provincia-dialog.component.html',
  styleUrls: ['./add-edit-provincia-dialog.component.scss']
})
export class AddEditProvinciaDialogComponent {

  public formGroup: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    
    this.setUpForm();
    if(this.data.codigo) this.setFormValues()
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo: new UntypedFormControl({
        value:'', disabled: this.data.codigo
        && this.data.title === 'Editar Provincia'},Validators.compose([
        Validators.maxLength(1),
        Validators.minLength(1),
        isAlphanumeric,
      ])
    ),
      nombre_provincia: new UntypedFormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          isAlphanumericWithSpaces
        ])
      ),
      codifica_altura: new UntypedFormControl({value: 'N', disabled: !this.data.edit},
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2)]
        )
      ),
      codigo_provincia: new UntypedFormControl('', Validators.compose([
        Validators.maxLength(2),
        Validators.minLength(2),
        Validators.pattern("^[0-9]*$"),
        isNumeric
        ])
      ),
      flete_transportista: new UntypedFormControl('', Validators.compose([
        Validators.maxLength(7),
        Validators.minLength(1),
        Validators.max(999.999),
        isNumeric
        ])
      ),
    })
  }

  private setFormValues(): void {
    this.formGroup.get('codigo')?.setValue(this.data.codigo);
    this.formGroup.get('nombre_provincia')?.setValue(this.data.nombre_provincia);
    this.formGroup.get('codifica_altura')?.setValue(this.data.codifica_altura);
    this.formGroup.get('codigo_provincia')?.setValue(this.data.codigo_provincia);
    this.formGroup.get('flete_transportista')?.setValue(this.data.flete_transportista);    
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
          par_modo: this.data.par_modo,
          codigo: this.formGroup.get('codigo')?.value,
          nombre_provincia: this.formGroup.get('nombre_provincia')?.value,
          codifica_altura: this.formGroup.get('codifica_altura')?.value,
          codigo_provincia: this.formGroup.get('codigo_provincia')?.value,
          flete_transportista: this.formGroup.get('flete_transportista')?.value
        })
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
        return `No puede contener letras, caracteres especiales`
      }
    }    
    return '';
  }
}