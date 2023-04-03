import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isAlphanumericWithSpaces } from 'src/app/core/validators/character.validator';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-abm-departamento-dialog',
  templateUrl: './edit-abm-departamento-dialog.component.html',
  styleUrls: ['./edit-abm-departamento-dialog.component.scss']
})
export class EditAbmDepartamentoDialogComponent {

  public formGroup: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    
    this.setUpForm();
    if(this.data.letra_provincia) this.setFormValues()
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      letra_provincia: new UntypedFormControl({value:'',
      disabled: this.data.letra_provincia && 
      this.data.title === 'Editar Departamento'},Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(1),
      ])
    ),
    codigo_departamento: new UntypedFormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(3),
      ])
    ),
      descripcion: new UntypedFormControl('', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          isAlphanumericWithSpaces
        ])
      ),
      descripcion_reducida: new UntypedFormControl('', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(15),
        ])
      ),
    })
  }

  private setFormValues(): void {
    this.formGroup.get('letra_provincia')?.setValue(this.data.letra_provincia);
    this.formGroup.get('codigo_departamento')?.setValue(this.data.codigo_departamento);
    this.formGroup.get('descripcion')?.setValue(this.data.descripcion);    
    this.formGroup.get('descripcion_reducida')?.setValue(this.data.descripcion_reducida);    
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.data.letra_provincia 
        ? this.dialogRef.close({
          par_modo: 'U',
          id_tabla: 10,
          letra_provincia:  this.formGroup.get('letra_provincia')?.value,
          codigo_departamento:  this.formGroup.get('codigo_departamento')?.value,
          descripcion:  this.formGroup.get('descripcion')?.value,
          descripcion_reducida:  this.formGroup.get('descripcion_reducida')?.value,
        })
        : this.dialogRef.close({
          par_modo: 'I',
          id_tabla: 10,
          letra_provincia:  this.formGroup.get('letra_provincia')?.value,
          codigo_departamento:  this.formGroup.get('codigo_departamento')?.value,
          descripcion:  this.formGroup.get('descripcion')?.value,
          descripcion_reducida:  this.formGroup.get('descripcion_reducida')?.value,
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
