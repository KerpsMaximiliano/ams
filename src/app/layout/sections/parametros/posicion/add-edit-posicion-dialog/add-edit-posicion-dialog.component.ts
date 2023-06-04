import { Component, Inject } from '@angular/core';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Material
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

// * Validations
import {
  isAlphanumericWithSpaces,
  isNumeric,
} from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { ModalLocalidadComponent } from './modal-localidad/modal-localidad.component';

@Component({
  selector: 'app-add-edit-posicion-dialog',
  templateUrl: './add-edit-posicion-dialog.component.html',
  styleUrls: ['./add-edit-posicion-dialog.component.scss'],
})
export class AddEditPosicionDialogComponent {
  public formGroup: UntypedFormGroup;
  vigencia: boolean = false;
  fecha_hoy: Date = new Date();
  paramLocal: [] | any;
  paramProv: [] | any;
  searchDescription: any;
  searchCodePost: any;
  dataSource: any;
  localidad: any;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.setUpForm();
    if (this.data.codigo_posicion) this.setFormValues();
    if (
      this.data.fecha_vigencia == 0 ||
      this.data.fecha_vigencia > this.fecha_hoy
    ) {
      this.vigencia = true;
    } else {
      this.vigencia = false;
    }
  }

  getLocalidad() {
    const modalSearchLocal = this.dialog.open(ModalLocalidadComponent, {
      data: {
        title: `SELECCIONAR LOCALIDAD`,
        par_modo: 'C',
      },
    });

    modalSearchLocal.afterClosed().subscribe({
      next: (datos) => {
        this.localidad = datos.datos;
        console.log(this.localidad);
        if (this.localidad) {
          this.formGroup.get('localidad')?.setValue(this.localidad.descripcion);
          this.formGroup
            .get('codigo_postal')
            ?.setValue(this.localidad.codigo_postal);
          this.formGroup
            .get('sub_codigo_postal')
            ?.setValue(this.localidad.sub_codigo_postal);
          this.formGroup
            .get('letra_provincia')
            ?.setValue(this.localidad.letra_provincia);
        }
      },
      error: (err) => {},
    });
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_posicion: new UntypedFormControl(
        {
          value: '',
          disabled:
            this.data.codigo_posicion && this.data.title === 'EDITAR POSICIÓN',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(3),
          isNumeric,
        ])
      ),
      descripcion: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30),
          isAlphanumericWithSpaces(),
        ])
      ),
      localidad: new UntypedFormControl(''),
      domicilio: new UntypedFormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          isAlphanumericWithSpaces(),
        ])
      ),
      codigo_postal: new UntypedFormControl(''),
      sub_codigo_postal: new UntypedFormControl(''),
      control_rechazo: new UntypedFormControl(
        { value: 'N', disabled: !this.data.edit },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
      yes_no: new UntypedFormControl({ value: 'N', disabled: !this.data.edit }),
      fecha_vigencia: new UntypedFormControl(''),
      letra_provincia: new UntypedFormControl(''),
    });
  }

  private setFormValues(): void {
    this.formGroup.get('codigo_posicion')?.setValue(this.data.codigo_posicion),
      this.formGroup.get('descripcion')?.setValue(this.data.descripcion),
      this.formGroup.get('domicilio')?.setValue(this.data.domicilio),
      this.formGroup.get('codigo_postal')?.setValue(this.data.codigo_postal),
      this.formGroup
        .get('sub_codigo_postal')
        ?.setValue(this.data.sub_codigo_postal),
      this.formGroup
        .get('control_rechazo')
        ?.setValue(this.data.control_rechazo),
      this.formGroup.get('yes_no')?.setValue(this.data.yes_no),
      this.formGroup.get('fecha_vigencia')?.setValue(this.data.fecha_vigencia),
      this.formGroup
        .get('letra_provincia')
        ?.setValue(this.data.letra_provincia);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
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
            fecha_vigencia: this.fecha(
              this.formGroup.get('fecha_vigencia')?.value
            ),
            letra_provincia: this.formGroup.get('letra_provincia')?.value,
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
            fecha_vigencia: this.fecha(
              this.formGroup.get('fecha_vigencia')?.value
            ),
            letra_provincia: this.formGroup.get('letra_provincia')?.value,
          });
    }
  }

  fecha(fecha: any) {
    let auxFecha: number;
    let ano = this.fecha_hoy.getFullYear().toString();
    let mes = (this.fecha_hoy.getMonth() + 1).toString();
    if (mes.length == 1) {
      mes = '0' + mes;
    }
    let dia = this.fecha_hoy.getDate().toString();
    if (dia.length == 1) {
      dia = '0' + dia;
    }
    auxFecha = parseInt(ano + mes + dia);
    console.log(this.formGroup.get('fecha_vigencia')?.value);
    console.log(this.formGroup.value);
    return auxFecha;
  }

  getErrorMessage(control: any): string {
    if (control.errors?.['required']) {
      return `Campo requerido`;
    } else {
      if (control.errors?.['maxlength']) {
        return `No puede contener más de ${control.errors?.['maxlength'].requiredLength} caracteres`;
      }
      if (control.errors?.['minlength']) {
        return `Debe contener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
      }
      if (
        (control.errors?.['notAlphanumeric'] ||
          control.errors?.['notAlphanumericWithSpaces']) &&
        control.value != '' &&
        control.value != null
      ) {
        return `No puede contener caracteres especiales`;
      }
    }
    return '';
  }
}
