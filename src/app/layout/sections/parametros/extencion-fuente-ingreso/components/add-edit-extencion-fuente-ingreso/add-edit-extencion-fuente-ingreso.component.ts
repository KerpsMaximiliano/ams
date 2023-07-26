import { Component, Inject } from '@angular/core';

// * service
import { UtilService } from 'src/app/core/services/util.service';
import { ExtencionFuenteIngresoService } from 'src/app/core/services/extencion-fuente-ingreso.service';

// * Form
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

// * Material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// * Validations
import {
  getErrorMessage,
  notOnlySpaces,
  isNumeric,
  isDecimal,
} from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-extencion-fuente-ingreso',
  templateUrl: './add-edit-extencion-fuente-ingreso.component.html',
  styleUrls: ['./add-edit-extencion-fuente-ingreso.component.scss'],
})
export class AddEditExtencionFuenteIngresoComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  validarRemuneracion: boolean = true;
  remuneracionMax: number = 1000000000;
  remuneracionMin: number;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private extencionFuenteIngreso: ExtencionFuenteIngresoService,
    private utilService: UtilService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   * 1. 'this.setUpForm();': Asigna las validaciones correspondientes a cada campo de entrada/selección.
   //  * 2. Condición: comprueba que sea una actualización (modificación) o lectura.
   * 2. 'this.setFormValues();': Asigna los valores de 'data' a los campos de entrada/selección del formulario.
   * 4. Condición: comprueba si la edición esta deshabilitada.
   *     > Deshabilidada: deshabilita el formulario.
   *     > Habilitada: deshabilita el 'fecha_de_vigencia'.
   */
  ngOnInit(): void {
    this.setUpForm();
    if (this.data.par_modo === 'U' || this.data.par_modo === 'R') {
      if (this.data.edit === false) {
        this.formGroup.disable();
      } else {
        this.formGroup.disable();
        this.formGroup.get('coeficiente_uno')?.enable();
        this.formGroup.get('coeficiente_dos')?.enable();
        this.formGroup.get('coeficiente_tres')?.enable();
        this.formGroup.get('coeficiente_cuatro')?.enable();
        this.formGroup.get('coeficiente_cinco')?.enable();
      }
    } else {
      this.formGroup.get('fecha_de_vigencia')?.disable();
      this.formGroup.get('fuente_ingreso')?.disable();
      this.formGroup.get('producto_des')?.disable();
      this.valorInicialRemDesde();
    }
    this.configureValidators();
    this.Remuneracion();
  }

  configureValidators() {
    const controlDesde = this.formGroup.get(
      'remuneracion_desde'
    ) as UntypedFormControl;
    controlDesde.setValidators([
      Validators.required,
      Validators.min(0.0),
      Validators.maxLength(12),
      this.validacionRemuneracionDesde(),
      this.validarPunto(),
      this.validarRemMaximo(),
      this.Decimal(),
    ]);
    controlDesde.updateValueAndValidity();
    const controlHasta = this.formGroup.get(
      'remuneracion_hasta'
    ) as UntypedFormControl;
    controlHasta.setValidators([
      Validators.required,
      Validators.maxLength(12),
      this.validacionRemuneracionHasta(),
      this.validarPunto(),
      this.validarRemMaximo(),
      this.Decimal(),
    ]);
    controlHasta.updateValueAndValidity();
    const controlCoef1 = this.formGroup.get(
      'coeficiente_uno'
    ) as UntypedFormControl;
    controlCoef1.setValidators([
      Validators.required,
      Validators.maxLength(4),
      this.validacionCoeficiente(),
      this.validarPunto(),
      this.Decimal(),
    ]);
    controlCoef1.updateValueAndValidity();
    const controlCoef2 = this.formGroup.get(
      'coeficiente_dos'
    ) as UntypedFormControl;
    controlCoef2.setValidators([
      Validators.required,
      Validators.maxLength(4),
      this.validacionCoeficiente(),
      this.validarPunto(),
      this.Decimal(),
    ]);
    controlCoef2.updateValueAndValidity();
    const controlCoef3 = this.formGroup.get(
      'coeficiente_tres'
    ) as UntypedFormControl;
    controlCoef3.setValidators([
      Validators.required,
      Validators.maxLength(4),
      this.validacionCoeficiente(),
      this.validarPunto(),
      this.Decimal(),
    ]);
    controlCoef3.updateValueAndValidity();
    const controlCoef4 = this.formGroup.get(
      'coeficiente_cuatro'
    ) as UntypedFormControl;
    controlCoef4.setValidators([
      Validators.required,
      Validators.maxLength(4),
      this.validacionCoeficiente(),
      this.validarPunto(),
      this.Decimal(),
    ]);
    controlCoef4.updateValueAndValidity();
    const controlCoef5 = this.formGroup.get(
      'coeficiente_cinco'
    ) as UntypedFormControl;
    controlCoef5.setValidators([
      Validators.required,
      Validators.maxLength(4),
      this.validacionCoeficiente(),
      this.validarPunto(),
      this.Decimal(),
    ]);
    controlCoef5.updateValueAndValidity();
  }

  Decimal(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value.toString().replace(',', '.');
      const regex = /^\d+(\.\d{1,2})?$/;

      if (!regex.test(value)) {
        return {
          error: 'Solo se permiten hasta 2 (dos) decimales.',
        };
      }
      return null;
    };
  }

  validacionCoeficiente(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const coeficiente = parseFloat(
        control.value.toString().replace(',', '.')
      );
      if (coeficiente < 0 || coeficiente >= 1) {
        return {
          error: 'Debe ser un número entre 0 y 0,99. Ej: 0,12.',
        };
      }
      return null;
    };
  }

  validacionRemuneracionDesde(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const desde = control.value
        ? parseFloat(control.value.toString().replace(',', '.'))
        : 0;
      this.Remuneracion();
      if (desde != 0 && desde < this.remuneracionMin) {
        return {
          error:
            'Remuneración Desde debe ser mayor que ' +
            this.remuneracionMin.toString().replace('.', ',') +
            '.',
        };
      }
      return null;
    };
  }

  validarRemMaximo(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value > 999999999.99) {
        return {
          error: 'No debe ser mayor que 999999999,99',
        };
      }
      return null;
    };
  }

  validarPunto(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value.includes('.')) {
        return {
          error: 'No puede contener puntos (.)',
        };
      }
      return null;
    };
  }

  validacionRemuneracionHasta(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const desde = this.formGroup.get('remuneracion_desde')?.value
        ? parseFloat(
            this.formGroup
              .get('remuneracion_desde')
              ?.value.toString()
              .replace(',', '.')
          )
        : 0;
      const hasta = this.formGroup.get('remuneracion_hasta')?.value
        ? parseFloat(
            this.formGroup
              .get('remuneracion_hasta')
              ?.value.toString()
              .replace(',', '.')
          )
        : 0;
      this.Remuneracion();
      if (desde != 0 && hasta <= desde) {
        return {
          error: 'Remuneración Hasta debe ser mayor que Remuneración Desde',
        };
      }
      return null;
    };
  }

  Remuneracion() {
    if (
      parseFloat(
        this.formGroup
          .get('remuneracion_desde')
          ?.value.toString()
          .replace(',', '.')
      ) >=
      parseFloat(
        this.formGroup
          .get('remuneracion_hasta')
          ?.value.toString()
          .replace(',', '.')
      )
    ) {
      this.validarRemuneracion = true;
    } else {
      this.validarRemuneracion = false;
    }
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      fecha_de_vigencia: new UntypedFormControl(
        this.data.fecha_de_vigencia ? this.data.fecha_de_vigencia : 0,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          isNumeric(),
        ])
      ),
      codigo_fuente_ingreso: new UntypedFormControl(
        this.data.codigo_fuente_ingreso ? this.data.codigo_fuente_ingreso : 0,
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(5),
          isNumeric(),
        ])
      ),
      fuente_ingreso: new UntypedFormControl(
        this.data.fuente_ingreso ? this.data.fuente_ingreso : '',
        Validators.compose([Validators.required, notOnlySpaces()])
      ),
      producto: new UntypedFormControl(
        this.data.producto ? this.data.producto : 0,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          isNumeric(),
        ])
      ),
      producto_des: new UntypedFormControl(
        this.data.producto_des ? this.data.producto_des.trim() : ''
      ),
      remuneracion_desde: new UntypedFormControl(
        this.data.remuneracion_desde
          ? this.data.remuneracion_desde.toString().replace('.', ',')
          : '0'
      ),
      remuneracion_hasta: new UntypedFormControl(
        this.data.remuneracion_hasta
          ? this.data.remuneracion_hasta.toString().replace('.', ',')
          : '0'
      ),
      coeficiente_uno: new UntypedFormControl(
        this.data.coeficiente_uno
          ? this.data.coeficiente_uno.toString().replace('.', ',')
          : '0'
      ),
      coeficiente_dos: new UntypedFormControl(
        this.data.coeficiente_dos
          ? this.data.coeficiente_dos.toString().replace('.', ',')
          : '0'
      ),
      coeficiente_tres: new UntypedFormControl(
        this.data.coeficiente_tres
          ? this.data.coeficiente_tres.toString().replace('.', ',')
          : '0'
      ),
      coeficiente_cuatro: new UntypedFormControl(
        this.data.coeficiente_cuatro
          ? this.data.coeficiente_cuatro.toString().replace('.', ',')
          : '0'
      ),
      coeficiente_cinco: new UntypedFormControl(
        this.data.coeficiente_cinco
          ? this.data.coeficiente_cinco.toString().replace('.', ',')
          : '0'
      ),
    });
  }

  private valorInicialRemDesde(): void {
    this.utilService.openLoading();
    this.extencionFuenteIngreso
      .CRUD(
        JSON.stringify({
          par_modo: 'H',
          codigo_fuente_ingreso: this.formGroup.get('codigo_fuente_ingreso')
            ?.value,
          fecha_de_vigencia: this.formGroup.get('fecha_de_vigencia')?.value,
          producto: this.formGroup.get('producto')?.value,
        })
      )
      .subscribe({
        next: (res: any) => {
          this.utilService.closeLoading();
          this.formGroup
            .get('remuneracion_desde')
            ?.setValue(
              res.dataset.remuneracion_hasta.toString().replace('.', ',')
            );
          this.remuneracionMin = res.dataset.remuneracion_hasta;
        },
        error: (err: any) => {
          this.utilService.closeLoading();
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }

  public limpiar(): void {
    this.formGroup.get('producto')?.setValue(0);
    this.formGroup.get('producto_des')?.setValue('');
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public closeOpenDialog(): void {
    this.confirm(true);
  }

  public confirm(reload: boolean): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close({
        datos: {
          par_modo: this.data.par_modo,
          fecha_de_vigencia: this.formGroup.get('fecha_de_vigencia')?.value,
          codigo_fuente_ingreso: this.formGroup.get('codigo_fuente_ingreso')
            ?.value,
          producto: this.formGroup.get('producto')?.value,
          remuneracion_desde: parseFloat(
            this.formGroup
              .get('remuneracion_desde')
              ?.value.toString()
              .replace(',', '.')
          ),
          remuneracion_hasta: parseFloat(
            this.formGroup
              .get('remuneracion_hasta')
              ?.value.toString()
              .replace(',', '.')
          ),
          coeficiente_uno: parseFloat(
            this.formGroup
              .get('coeficiente_uno')
              ?.value.toString()
              .replace(',', '.')
          ),
          coeficiente_dos: parseFloat(
            this.formGroup
              .get('coeficiente_dos')
              ?.value.toString()
              .replace(',', '.')
          ),
          coeficiente_tres: parseFloat(
            this.formGroup
              .get('coeficiente_tres')
              ?.value.toString()
              .replace(',', '.')
          ),
          coeficiente_cuatro: parseFloat(
            this.formGroup
              .get('coeficiente_cuatro')
              ?.value.toString()
              .replace(',', '.')
          ),
          coeficiente_cinco: parseFloat(
            this.formGroup
              .get('coeficiente_cinco')
              ?.value.toString()
              .replace(',', '.')
          ),
        },
        reload: reload,
      });
    }
  }
}
