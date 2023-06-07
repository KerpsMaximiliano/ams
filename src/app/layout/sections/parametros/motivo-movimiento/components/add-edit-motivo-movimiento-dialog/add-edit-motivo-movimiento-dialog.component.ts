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
  notOnlySpaces,
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
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  fechaNum: string; // Utlizado para almacenar la fecha de hoy, pero en formato para poder almacenarlo en la base de datos.
  fecha_hoy: string | undefined;
  fecha_fin: number = 0; // si se da de baja, se cambia el valor con el metodo 'darseBaja()'

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   * 1. 'this.setUpForm();': Asigna las validaciones correspondientes a cada campo de entrada/selección.
   * 2. Condición: comprueba que sea una actualización (modificación) o lectura.
   * 3. 'this.setFormValues();': Asigna los valores de 'data' a los campos de entrada/selección del formulario.
   * 4. Condición: comprueba si la edición esta deshabilitada.
   *     > Deshabilidada: deshabilita el formulario.
   *     > Habilitada: deshabilita el 'id_motivo'.
   */
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
    if (this.data.par_modo === 'U' || this.data.par_modo === 'R') {
      this.setFormValues();
      if (this.data.edit === false) {
        this.formGroup.disable();
      } else {
        this.formGroup.get('id_motivo')?.disable();
        this.formGroup.get('tipo_motivo')?.disable();
      }
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      id_motivo: new UntypedFormControl(
        this.data.id_motivo,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric(),
        ])
      ),
      tipo_motivo: new UntypedFormControl(
        this.data.tipo_motivo,
        Validators.compose([Validators.required])
      ),
      descripcion: new UntypedFormControl(
        this.data.descripcion ? this.data.descripcion.trim() : '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30),
          isAlphanumericWithSpaces(),
          notOnlySpaces(),
        ])
      ),
      datos_adic_SN: new UntypedFormControl(
        this.data.datos_adic_SN,
        Validators.compose([Validators.required])
      ),
      fecha_inicio_vigencia: new UntypedFormControl(
        this.data.fecha_inicio_vigencia,
        Validators.compose([Validators.required])
      ),
    });
  }

  private setFormValues(): void {
    this.formGroup.get('id_motivo')?.setValue(this.data.id_motivo);
    this.formGroup.get('tipo_motivo')?.setValue(this.data.tipo_motivo);
    this.formGroup
      .get('descripcion')
      ?.setValue(this.data.descripcion ? this.data.descripcion.trim() : '');
    this.formGroup.get('datos_adic_SN')?.setValue(this.data.datos_adic_SN);
    this.formGroup
      .get('fecha_inicio_vigencia')
      ?.setValue(this.calcularFecha(this.data.fecha_inicio_vigencia));
    this.formGroup
      .get('fecha_fin_vigencia')
      ?.setValue(this.data.fecha_fin_vigencia);
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    const newDate = new Date(
      this.formGroup.get('fecha_inicio_vigencia')?.value
    );
    const fecha = this.datePipe.transform(
      newDate.getFullYear() +
        '-' +
        (newDate.getMonth() + 1) +
        '-' +
        (newDate.getDate() + 1),
      'yyyyMMdd'
    );
    if (this.formGroup.valid) {
      this.dialogRef.close({
        par_modo: this.data.par_modo,
        id_motivo: this.formGroup.get('id_motivo')?.value,
        descripcion: this.formGroup.get('descripcion')?.value,
        tipo_motivo: this.formGroup.get('tipo_motivo')?.value,
        datos_adic_SN: this.formGroup.get('datos_adic_SN')?.value,
        fecha_inicio_vigencia: Number(fecha),
        fecha_fin_vigencia: this.fecha_fin !== undefined ? this.fecha_fin : 0,
      });
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
          (dateFecha.getDate() + 1),
        'yyyy-MM-dd'
      );
    } else {
      return null;
    }
  }

  public darseBaja() {
    this.fecha_fin = Number(this.datePipe.transform(new Date(), 'yyyyMMdd'));
  }

  public darseAlta() {
    this.fecha_fin = 0;
  }
}
