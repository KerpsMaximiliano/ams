import { Component, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Validations
import {
  isAlphanumericWithSpaces,
  isNumeric,
  getErrorMessage,
} from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-motivo-movimiento-dialog',
  templateUrl: './add-edit-motivo-movimiento-dialog.component.html',
  styleUrls: ['./add-edit-motivo-movimiento-dialog.component.scss'],
  providers: [DatePipe],
})
export class AddEditMotivoMovimientoDialogComponent {
  fechaNum: string; // Utlizado para almacenar la fecha de hoy, pero en formato para poder almacenarlo en la base de datos.
  fecha_hoy: string | undefined;
  fecha_fin: number = 0; // si se da de baja, se cambia el valor con el metodo 'darseBaja()'
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    let fecha = new Date();
    const fechaEndPicker =
      fecha.getFullYear() +
      '-' +
      (fecha.getMonth() + 1) +
      '-' +
      (fecha.getDate() + 1);
    this.fecha_hoy = this.datePipe
      .transform(fechaEndPicker, 'yyyy-MM-dd')
      ?.toString();
    this.fecha_fin = this.data.fecha_fin_vigencia;

    this.setUpForm();
    if (this.data.id_motivo !== undefined) {
      this.setFormValues();
    }
    if (!this.data.edit && this.data.par_modo === 'C') {
      this.formGroup.disable();
    }
  }

  public calcularFecha(fecha: number) {
    const newFecha = fecha.toString();
    if (fecha != null) {
      const dateFecha = new Date(
        newFecha.slice(0, 4) +
          '-' +
          newFecha.slice(4, 6) +
          '-' +
          newFecha.slice(6, 8)
      );
      return this.datePipe.transform(
        dateFecha.getFullYear() +
          '-' +
          (dateFecha.getMonth() + 1) +
          '-' +
          (dateFecha.getDate() + 2),
        'yyyy-MM-dd'
      );
    } else {
      return null;
    }
  }

  public darseBaja() {
    this.fecha_fin = Number(this.datePipe.transform(new Date(), 'yyyyMMdd'));
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      tipo_motivo: new UntypedFormControl(
        { value: '', disabled: this.data.par_modo !== 'I' },
        Validators.compose([Validators.required])
      ),
      id_motivo: new UntypedFormControl(
        { value: '', disabled: this.data.par_modo !== 'I' },
        Validators.compose([Validators.required, isNumeric()])
      ),
      descripcion: new UntypedFormControl(
        { value: '', disabled: !this.data.edit },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30),
          isAlphanumericWithSpaces(),
        ])
      ),
      datos_adic_SN: new UntypedFormControl(
        { value: '', disabled: !this.data.edit },
        Validators.compose([Validators.required])
      ),
      fecha_inicio_vigencia: new UntypedFormControl(
        {
          value: '',
          disabled: this.data.par_modo !== 'I',
        },
        Validators.compose([Validators.required])
      ),
    });
  }

  private setFormValues(): void {
    // id motivo
    this.formGroup.get('id_motivo')?.setValue(this.data.id_motivo);

    // tipo de motivo
    if (this.data.tipo_motivo !== undefined) {
      this.formGroup.get('tipo_motivo')?.setValue(this.data.tipo_motivo);
    }

    // descripcion
    if (this.data.descripcion !== undefined) {
      this.formGroup.get('descripcion')?.setValue(this.data.descripcion);
    }

    // datos adicionales
    if (this.data.datos_adic_SN !== undefined) {
      this.formGroup.get('datos_adic_SN')?.setValue(this.data.datos_adic_SN);
    }

    // fecha inicio vigencia
    if (this.data.fecha_inicio_vigencia !== undefined) {
      this.formGroup
        .get('fecha_inicio_vigencia')
        ?.setValue(this.calcularFecha(this.data.fecha_inicio_vigencia));
    }

    // fecha fin vigencia
    if (this.data.fecha_fin_vigencia !== undefined) {
      this.formGroup
        .get('fecha_fin_vigencia')
        ?.setValue(this.data.fecha_fin_vigencia);
    }
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    const newDate = this.datePipe.transform(
      new Date(this.formGroup.get('fecha_inicio_vigencia')?.value),
      'yyyyMMdd'
    );
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        id_motivo: this.formGroup.get('id_motivo')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        tipo_motivo: this.formGroup.get('tipo_motivo')?.value,
        datos_adic_SN: this.formGroup.get('datos_adic_SN')?.value,
        fecha_inicio_vigencia: Number(newDate),
        fecha_fin_vigencia: this.fecha_fin !== undefined ? this.fecha_fin : 0,
      });
    }
  }
}
