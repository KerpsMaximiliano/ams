import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isAlphanumeric, isAlphanumericWithSpaces, isNumeric } from 'src/app/core/validators/character.validator';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-tipo-provincia-dialog',
  templateUrl: './edit-tipo-provincia-dialog.component.html',
  styleUrls: ['./edit-tipo-provincia-dialog.component.scss']
})
export class EditTipoProvinciaDialogComponent {

  public formGroup: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    
    this.setUpForm();
    if(this.data.Cod_provincia) this.setFormValues()
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      Cod_provincia: new UntypedFormControl({
        value:'', disabled: this.data.Cod_provincia
        && this.data.title === 'Editar Provincia'},Validators.compose([
        Validators.maxLength(1),
        Validators.minLength(1),
        isAlphanumeric,
      ])
    ),
      descripcion: new UntypedFormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          isAlphanumericWithSpaces
        ])
      ),
      Codifica_Alturas: new UntypedFormControl('', Validators.compose([
        Validators.maxLength(1),
        Validators.minLength(1),
        isAlphanumeric,
        ])
      ),
      Codigo_provincia: new UntypedFormControl('', Validators.compose([
        Validators.maxLength(2),
        Validators.minLength(2),
        Validators.pattern("^[0-9]*$"),
        isNumeric
        ])
      ),
      Flete_Transportistas: new UntypedFormControl('', Validators.compose([
        Validators.maxLength(7),
        Validators.minLength(1),
        Validators.max(999.999),
        isNumeric
        ])
      ),
    })
  }

  private setFormValues(): void {
    this.formGroup.get('Cod_provincia')?.setValue(this.data.Cod_provincia);
    this.formGroup.get('descripcion')?.setValue(this.data.descripcion);
    this.formGroup.get('Codifica_Alturas')?.setValue(this.data.Codifica_Alturas);
    this.formGroup.get('Codigo_provincia')?.setValue(this.data.Codigo_provincia);
    this.formGroup.get('Flete_Transportistas')?.setValue(this.data.Flete_Transportistas);    
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.data.codigo_provincia 
        ? this.dialogRef.close({
            par_modo: 'U',
            Cod_provincia: this.formGroup.get('Cod_provincia')?.value,
            descripcion: this.formGroup.get('descripcion')?.value,
            Codifica_Alturas: this.formGroup.get('Codifica_Alturas')?.value,
            Codigo_provincia: this.formGroup.get('Codigo_provincia')?.value,
            Flete_Transportistas: this.formGroup.get('Flete_Transportistas')?.value
        })
        : this.dialogRef.close({
          par_modo: 'I',
          Cod_provincia: this.formGroup.get('Cod_provincia')?.value,
          descripcion: this.formGroup.get('descripcion')?.value,
          Codifica_Alturas: this.formGroup.get('Codifica_Alturas')?.value,
          Codigo_provincia: this.formGroup.get('Codigo_provincia')?.value,
          Flete_Transportistas: this.formGroup.get('Flete_Transportistas')?.value
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
        return `No puede contener letras, caracteres especiales`
      }
    }    
    return '';
  }
}
