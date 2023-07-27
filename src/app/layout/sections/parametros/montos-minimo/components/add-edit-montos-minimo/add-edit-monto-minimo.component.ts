import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';

// * Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validators
import {
  afterComma,
  getErrorMessage,
  isAlpha,
  isMax,
  isNumberAndComma,
  isNumeric,
  notChar,
  onlyTwoDecimal,
} from 'src/app/core/validators/character.validator';

@Component({
  selector: 'app-add-edit-monto-minimo',
  templateUrl: './add-edit-monto-minimo.component.html',
  styleUrls: ['./add-edit-monto-minimo.component.scss'],
  providers: [DatePipe],
})
export class AddEditMontoMinimoComponent implements OnInit {
  public formGroup: UntypedFormGroup;
  public fecha_hoy: string | undefined;
  public getErrorMessage = getErrorMessage;

  constructor(
    private dataSharingService: DataSharingService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
    this.validate();
  }

  ngOnInit() {
    const fechaEndPicker = this.calcularFecha(new Date());
    this.fecha_hoy = this.datePipe
      .transform(fechaEndPicker, 'yyyy-MM-dd')
      ?.toString();
  }

  public confirm(): void {
    if (this.formGroup.valid || this.data.par_modo === 'D') {
      const fecha = this.datePipe.transform(
        this.calcularFecha(
          new Date(this.formGroup.get('fecha_vigencia')?.value)
        ),
        'yyyyMMdd'
      );
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        actividad: this.formGroup.get('actividad')?.value,
        seccion: this.formGroup.get('seccion')?.value,
        fecha_vigencia: Number(fecha),
        importe_minimo: this.formGroup
          .get('importe_minimo')
          ?.value.toString()
          .replace(',', '.'),
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public clear(inputActividad: HTMLInputElement): void {
    inputActividad.value = '';
  }

  public validateNumberInput(event: KeyboardEvent): void {
    const inputValue: string = this.formGroup.get('importe_minimo')?.value;
    if (
      (inputValue.length === 0 && event.key === ',') ||
      (inputValue.length === 0 && event.key === '.')
    ) {
      event.preventDefault();
    } else {
      if (
        (inputValue.includes(',') && event.key === ',') ||
        (inputValue.includes(',') && event.key === '.')
      ) {
        event.preventDefault();
      }
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

  private calcularValor(fecha: number) {
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

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      actividad: new UntypedFormControl(
        {
          value: this.data.actividad,
          disabled: this.data.par_modo === 'D' || this.data.par_modo === 'U',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(11),
          isNumeric(),
        ])
      ),
      seccion: new UntypedFormControl(
        {
          value: this.data.seccion ? this.data.seccion.trim() : '',
          disabled: this.data.par_modo === 'D' || this.data.par_modo === 'U',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      fecha_vigencia: new UntypedFormControl(
        {
          value:
            this.data.par_modo !== 'C'
              ? this.calcularValor(this.data.fecha_vigencia)
              : this.data.fecha_vigencia,
          disabled: this.data.par_modo === 'D' || this.data.par_modo === 'U',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
        ])
      ),
      importe_minimo: new UntypedFormControl(
        {
          value: this.data.importe_minimo ? this.data.importe_minimo : '',
          disabled: this.data.par_modo === 'D',
        },
        Validators.compose([
          Validators.required,
          notChar(),
          isNumberAndComma(),
          afterComma(),
          onlyTwoDecimal(),
          isMax(999999999),
        ])
      ),
    });
  }

  private validate(): void {
    this.formGroup
      .get('importe_minimo')
      ?.valueChanges.subscribe((value: any) => {
        if (value[0] === ',') {
          this.formGroup.get('importe_minimo')?.setValue('');
        }
        if (value.includes('.')) {
          this.formGroup
            .get('importe_minimo')
            ?.setValue(value.replace('.', ','));
        }
      });
  }
}
