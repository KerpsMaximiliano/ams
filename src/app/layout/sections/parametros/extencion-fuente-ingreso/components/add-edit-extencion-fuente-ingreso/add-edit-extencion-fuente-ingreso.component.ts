import { Component, Inject } from '@angular/core';

// * Form
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
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
  getErrorMessage,
  notOnlySpaces,
  isNumeric,
} from 'src/app/core/validators/character.validator';

// * Components
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { ModalExtencionProductoComponent } from './modal-extencion-producto/modal-extencion-producto.component';
import { ExtencionFuenteIngresoService } from 'src/app/core/services/extencion-fuente-ingreso.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-add-edit-extencion-fuente-ingreso',
  templateUrl: './add-edit-extencion-fuente-ingreso.component.html',
  styleUrls: ['./add-edit-extencion-fuente-ingreso.component.scss'],
})
export class AddEditExtencionFuenteIngresoComponent {
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  validarRemuneracion: boolean = true;
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
    this.configureValidators()
  }

  configureValidators() {
    const control = this.formGroup.get(
      'remuneracion_hasta'
    ) as UntypedFormControl;
    control.setValidators(this.validacionRemuneracion());
    control.updateValueAndValidity();
  }

  validacionRemuneracion(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const desde = parseFloat(this.formGroup.get('remuneracion_desde')?.value);
      const hasta = parseFloat(this.formGroup.get('remuneracion_hasta')?.value);

      if (desde !== null && hasta !== null && hasta <= desde) {
        return { error: "Remuneración Hasta debe ser mayor que Remuneración Desde" };
      }
      return null;
    };
  }

  Remuneracion() {
    if (
      parseFloat(this.formGroup.get('remuneracion_desde')?.value) >=
      parseFloat(this.formGroup.get('remuneracion_hasta')?.value)
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
        this.data.remuneracion_desde ? this.data.remuneracion_desde : 0,
        Validators.compose([
          Validators.required,
          Validators.min(0.0),
          isNumeric,
        ])
      ),
      remuneracion_hasta: new UntypedFormControl(
        this.data.remuneracion_hasta ? this.data.remuneracion_hasta : 0,
        Validators.compose([Validators.required, isNumeric])
      ),
      coeficiente_uno: new UntypedFormControl(
        this.data.coeficiente_uno ? this.data.coeficiente_uno : 0,
        Validators.compose([
          Validators.required,
          Validators.min(0.0),
          Validators.max(1.0),
          isNumeric,
        ])
      ),
      coeficiente_dos: new UntypedFormControl(
        this.data.coeficiente_dos ? this.data.coeficiente_dos : 0,
        Validators.compose([
          Validators.required,
          Validators.min(0.0),
          Validators.max(1),
          isNumeric,
        ])
      ),
      coeficiente_tres: new UntypedFormControl(
        this.data.coeficiente_tres ? this.data.coeficiente_tres : 0,
        Validators.compose([
          Validators.required,
          Validators.min(0.0),
          Validators.max(1),
          isNumeric,
        ])
      ),
      coeficiente_cuatro: new UntypedFormControl(
        this.data.coeficiente_cuatro ? this.data.coeficiente_cuatro : 0,
        Validators.compose([
          Validators.required,
          Validators.min(0.0),
          Validators.max(1),
          isNumeric,
        ])
      ),
      coeficiente_cinco: new UntypedFormControl(
        this.data.coeficiente_cinco ? this.data.coeficiente_cinco : 0,
        Validators.compose([
          Validators.required,
          Validators.min(0.0),
          Validators.max(1),
          isNumeric,
        ])
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
            ?.setValue(res.dataset.remuneracion_hasta);
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
          remuneracion_desde: this.formGroup.get('remuneracion_desde')?.value,
          remuneracion_hasta: this.formGroup.get('remuneracion_hasta')?.value,
          coeficiente_uno: this.formGroup.get('coeficiente_uno')?.value,
          coeficiente_dos: this.formGroup.get('coeficiente_dos')?.value,
          coeficiente_tres: this.formGroup.get('coeficiente_tres')?.value,
          coeficiente_cuatro: this.formGroup.get('coeficiente_cuatro')?.value,
          coeficiente_cinco: this.formGroup.get('coeficiente_cinco')?.value,
        },
        reload: reload,
      });
    }
  }
}
