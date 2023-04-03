import { Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isAlphanumeric, isAlphanumericWithSpaces, isNumeric } from 'src/app/core/validators/character.validator';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-abm-localidades-dialog',
  templateUrl: './edit-abm-localidades-dialog.component.html',
  styleUrls: ['./edit-abm-localidades-dialog.component.scss']
})
export class EditAbmLocalidadesDialogComponent {

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
        && this.data.title === 'Editar Localidad'},Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(4),
          Validators.required,
          isNumeric
        ])),
        subcodigo : new UntypedFormControl('',
          Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric
        ])),
        nombre_localidad : new UntypedFormControl('',
          Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(30),
          isAlphanumericWithSpaces
        ])),
        letra_provincia : new UntypedFormControl('',
          Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlphanumericWithSpaces
        ])),
        flete_transportista : new UntypedFormControl('',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(6),
          isNumeric
        ])),
        referente : new UntypedFormControl('',
          Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          isNumeric
        ])),
        medico : new UntypedFormControl({value: 'N', disabled: !this.data.edit},
          Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2)
        ])),
        zona_promocion : new UntypedFormControl('',
          Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric
        ])),
        cod_departamento : new UntypedFormControl('',
          Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          isNumeric
        ])),
        zona_envio : new UntypedFormControl('',
          Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
          isAlphanumericWithSpaces
        ])),
        // codifica_altura: new UntypedFormControl({value: 'N', disabled: !this.data.edit},Validators.compose([Validators.required,Validators.minLength(1),Validators.maxLength(2)])),
        ticket: new UntypedFormControl(
          {value: 'N', disabled: !this.data.edit},
          Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2)
        ])),
        zona_atencion: new UntypedFormControl('',
        Validators.compose([
          Validators.maxLength(3),
          Validators.minLength(1),
          Validators.pattern("^[0-9]*$"),
          isNumeric
        ])),
        habitantes: new UntypedFormControl('',
          Validators.compose([
          Validators.maxLength(8),
          Validators.minLength(1),
          isNumeric
        ])),
    })
  }

  
  
  private setFormValues(): void {
    this.formGroup.get('codigo')?.setValue(this.data.codigo);
    this.formGroup.get('subcodigo')?.setValue(this.data.subcodigo);
    this.formGroup.get('nombre_localidad')?.setValue(this.data.nombre_localidad);
    this.formGroup.get('letra_provincia')?.setValue(this.data.letra_provincia);
    this.formGroup.get('flete_transportista')?.setValue(this.data.flete_transportista);
    this.formGroup.get('referente')?.setValue(this.data.referente);
    this.formGroup.get('medico')?.setValue(this.data.medico);
    this.formGroup.get('zona_promocion')?.setValue(this.data.zona_promocion);
    this.formGroup.get('cod_departamento')?.setValue(this.data.cod_departamento);
    this.formGroup.get('zona_envio')?.setValue(this.data.zona_envio);
    this.formGroup.get('ticket')?.setValue(this.data.ticket);
    this.formGroup.get('zona_atencion')?.setValue(this.data.zona_atencion);
    this.formGroup.get('habitantes')?.setValue(this.data.habitantes);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.data.codigo_localidad 
        ? this.dialogRef.close({
          par_modo: 'U',
          codigo: this.data.codigo.value,
          subcodigo: this.data.subcodigo.value,
          nombre_localidad: this.data.nombre_localidad.value,
          letra_provincia: this.data.letra_provincia.value,
          flete_transportista: this.data.flete_transportista.value,
          referente: this.data.referente.value,
          medico: this.data.medico.value,
          zona_promocion: this.data.zona_promocion.value,
          cod_departamento: this.data.cod_departamento.value,
          zona_envio: this.data.zona_envio.value,
          ticket: this.data.ticket.value,
          zona_atencion: this.data.zona_atencion.value,
          habitantes: this.data.habitantes.value,
        })
        : this.dialogRef.close({
          par_modo: 'I',
          codigo: this.data.codigo.value,
          subcodigo: this.data.subcodigo.value,
          nombre_localidad: this.data.nombre_localidad.value,
          letra_provincia: this.data.letra_provincia.value,
          flete_transportista: this.data.flete_transportista.value,
          referente: this.data.referente.value,
          medico: this.data.medico.value,
          zona_promocion: this.data.zona_promocion.value,
          cod_departamento: this.data.cod_departamento.value,
          zona_envio: this.data.zona_envio.value,
          ticket: this.data.ticket.value,
          zona_atencion: this.data.zona_atencion.value,
          habitantes: this.data.habitantes.value,
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
