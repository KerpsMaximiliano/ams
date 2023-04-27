import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isAlphanumericWithSpaces, isNumeric } from 'src/app/core/validators/character.validator';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-abm-posiciones',
  templateUrl: './add-edit-abm-posiciones.component.html',
  styleUrls: ['./add-edit-abm-posiciones.component.scss']
})
export class AddEditAbmPosicionesComponent {

  public formGroup: UntypedFormGroup;
  vigencia: boolean = false;
  fecha_hoy: Date = new Date();
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data);
    
    console.log(this.fecha_hoy);
    this.setUpForm();
    if (this.data.codigo_posicion) this.setFormValues();
    if (this.data.fecha_vigencia == 0 || this.data.fecha_vigencia > this.fecha_hoy) {
      this.vigencia = true;
    } else{
      this.vigencia = false;
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_posicion: new UntypedFormControl('',Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(3),
        isNumeric
      ])),
      descripcion: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        isAlphanumericWithSpaces()
      ])),
      domicilio: new UntypedFormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        isAlphanumericWithSpaces()
      ])),
      codigo_postal: new UntypedFormControl(''),
      sub_codigo_postal: new UntypedFormControl(''),
      control_rechazo: new UntypedFormControl({value: 'N', disabled: !this.data.edit}, Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
      ])),
      yes_no: new UntypedFormControl({value: '', disabled: !this.data.edit}),
      fecha_vigencia: new UntypedFormControl(''),
      letra_provincia: new UntypedFormControl(''),
    })
  }

  private setFormValues(): void {
    this.formGroup.get('codigo_posicion')?.setValue(this.data.codigo_posicion),
    this.formGroup.get('descripcion')?.setValue(this.data.descripcion),
    this.formGroup.get('domicilio')?.setValue(this.data.domicilio),
    this.formGroup.get('codigo_postal')?.setValue(this.data.codigo_postal),
    this.formGroup.get('sub_codigo_postal')?.setValue(this.data.sub_codigo_postal),
    this.formGroup.get('control_rechazo')?.setValue(this.data.control_rechazo),
    this.formGroup.get('yes_no')?.setValue(this.data.yes_no),
    this.formGroup.get('fecha_vigencia')?.setValue(this.data.fecha_vigencia),
    this.formGroup.get('letra_provincia')?.setValue(this.data.letra_provincia)
  }

  closeDialog(): void {
    console.log(this.formGroup);
    
    this.dialogRef.close(false);
  }

  public confirm(): void {
    // this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.data.codigo_posicion
        ? this.dialogRef.close({
          par_modo: 'U',
          codigo_posicion: this.formGroup.get('codigo_posicion')?.value,
          descripcion: this.formGroup.get('descripcion')?.value,
          domicilio: this.formGroup.get('domicilio')?.value,
          codigo_postal: this.formGroup.get('codigo_postal')?.value,
          sub_codigo_postal: this.formGroup.get('sub_codigo_postal')?.value,
          control_rechazo: this.formGroup.get('control_rechazo')?.value,
          yes_no: this.formGroup.get('yes_no')?.value,
          fecha_vigencia: this.formGroup.get('fecha_vigencia')?.value,
        })
        : this.dialogRef.close({
          par_modo: 'I',
          codigo_posicion: this.formGroup.get('codigo_posicion')?.value,
          descripcion: this.formGroup.get('descripcion')?.value,
          domicilio: this.formGroup.get('domicilio')?.value,
          codigo_postal: this.formGroup.get('codigo_postal')?.value,
          sub_codigo_postal: this.formGroup.get('sub_codigo_postal')?.value,
          control_rechazo: this.formGroup.get('control_rechazo')?.value,
          yes_no: this.formGroup.get('yes_no')?.value,
          fecha_vigencia: this.formGroup.get('fecha_vigencia')?.value,
        });
    }
  }

  fecha() {
    let auxFecha: number;
    let ano = this.fecha_hoy.getFullYear().toString();
    let mes = (this.fecha_hoy.getMonth() + 1).toString();
    if (mes.length == 1) { mes = "0" + mes };
    let dia = this.fecha_hoy.getDate().toString()
    if (dia.length == 1) { dia = "0" + dia };
    auxFecha = parseInt(ano + mes + dia);
    this.formGroup.get('fecha_vigencia')?.setValue(auxFecha);
    console.log(this.formGroup.get('fecha_vigencia')?.value);
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
