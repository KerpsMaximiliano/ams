import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import {
  isNumeric,
  getErrorMessage,
  notOnlySpaces,
  isAlpha,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-motivo-movimiento-dialog',
  templateUrl: './add-edit-motivo-movimiento-dialog.component.html',
  styleUrls: ['./add-edit-motivo-movimiento-dialog.component.scss'],
  providers: [DatePipe],
})
export class AddEditMotivoMovimientoDialogComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  public fecha_hoy: string | undefined;
  public fecha_fin: number = 0;
  public status: boolean;

  constructor(
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataSharingService: DataSharingService
  ) {
    const fechaEndPicker = this.calcularFecha(new Date());

    this.fecha_hoy = this.datePipe
      .transform(fechaEndPicker, 'yyyy-MM-dd')
      ?.toString();

    this.fecha_fin = this.data.fecha_fin_vigencia;

    this.setUpForm();
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const fecha = this.datePipe.transform(
        this.calcularFecha(
          new Date(this.formGroup.get('fecha_inicio_vigencia')?.value)
        ),
        'yyyyMMdd'
      );
      this.dataSharingService.sendData({
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

  public calcularValor(fecha: number) {
    const newFecha = fecha.toString();
    if (fecha !== null) {
      const dateFecha = new Date(
        newFecha.slice(0, 4) +
          '-' +
          newFecha.slice(4, 6) +
          '-' +
          newFecha.slice(6, 8)
      );
      return this.datePipe.transform(
        this.calcularFecha(dateFecha),
        'yyyy-MM-dd'
      );
    } else {
      return this.data.fecha_inicio_vigencia;
    }
  }

  public calcularEstado() {
    if (this.fecha_fin === 0) {
      this.status = true;
      this.fecha_fin = Number(this.datePipe.transform(new Date(), 'yyyyMMdd'));
    } else {
      this.status = false;
      this.fecha_fin = 0;
    }
  }

  private calcularFecha(fecha: Date) {
    return (
      fecha.getFullYear() +
      '-' +
      (fecha.getMonth() + 1) +
      '-' +
      (fecha.getDate() + 1)
    );
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      id_motivo: new UntypedFormControl(
        {
          value: this.data.id_motivo,
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric(),
        ])
      ),
      tipo_motivo: new UntypedFormControl(
        {
          value: this.data.tipo_motivo ? this.data.tipo_motivo.trim() : '',
          disabled: this.data.par_modo === 'U' || this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      descripcion: new UntypedFormControl(
        {
          value: this.data.descripcion ? this.data.descripcion.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      datos_adic_SN: new UntypedFormControl(
        {
          value: this.data.datos_adic_SN ? this.data.datos_adic_SN.trim() : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      fecha_inicio_vigencia: new UntypedFormControl(
        {
          value:
            this.data.par_modo !== 'C'
              ? this.calcularValor(this.data.fecha_inicio_vigencia)
              : this.data.fecha_inicio_vigencia,
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([Validators.required])
      ),
    });
  }
}
