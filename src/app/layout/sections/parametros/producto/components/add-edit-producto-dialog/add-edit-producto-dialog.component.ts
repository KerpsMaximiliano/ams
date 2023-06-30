import { Component, Inject } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';

// * Form
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import {
  getErrorMessage,
  isNumeric,
  notOnlySpaces,
} from 'src/app/core/validators/character.validator';

// * Material
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SetProductoDialogComponent } from './set-producto-dialog/set-producto-dialog.component';
import { IFuenteIngreso } from 'src/app/core/models/fuente-ingreso.interface';
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';
import {
  IProducto,
  IProductoObraSocial,
} from 'src/app/core/models/producto.interface';
import { ProductoService } from 'src/app/core/services/producto.service';
import { Router } from '@angular/router';
import { IDialog } from 'src/app/core/models/dialog.interface';

@Component({
  selector: 'app-add-edit-producto-dialog',
  templateUrl: './add-edit-producto-dialog.component.html',
  styleUrls: ['./add-edit-producto-dialog.component.scss'],
})
export class AddEditProductoDialogComponent {
  private element: IDialog[];
  private date: number;
  public formGroup: UntypedFormGroup;
  public getErrorMessage = getErrorMessage;
  public status: boolean = false;
  public btnStatus: boolean = false;

  constructor(
    private dataSharingService: DataSharingService,
    private fuenteIngresoService: FuenteIngresoService,
    private productoService: ProductoService,
    private utilService: UtilService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
    this.configureValidators();
    if (this.data.par_modo !== 'C') {
      this.data.fecha_baja_producto === 0
        ? (this.status = false)
        : (this.status = true);
      this.date = this.formatDate(new Date());
      this.compareDate(this.data.fecha_baja_producto, this.date)
        ? (this.btnStatus = false)
        : (this.btnStatus = true);
    } else {
      this.data.fecha_baja_producto = 0;
    }
  }

  public confirm(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        codigo_producto: this.formGroup.get('codigo_producto')?.value,
        descripcion_producto: this.formGroup.get('descripcion_producto')?.value,
        descripcion_reducida: this.formGroup.get('descripcion_reducida')?.value,
        tipo_producto: this.formGroup.get('tipo_producto')?.value,
        producto_administrador: this.data.producto_administrador,
        clase_producto: this.formGroup.get('clase_producto')?.value,
        codigo_fuente_ingreso: this.data.codigo_fuente_ingreso,
        numero_empresa_factura: this.formGroup.get('numero_empresa_factura')
          ?.value,
        codigo_obra_social: this.data.codigo_obra_social,
        fecha_baja_producto: this.data.fecha_baja_producto,
        // Datos sin resolución.
        subprograma_afiliacion: this.data.subprograma_afiliacion,
        subprograma_parametros: this.data.subprograma_parametros,
        subprograma_calculo_valores: this.data.subprograma_calculo_valores,
        subprograma_calculo_comisiones:
          this.data.subprograma_calculo_comisiones,
        factura_primera: this.data.factura_primera,
        factura_segunda: this.data.factura_segunda,
        factura_tercera: this.data.factura_tercera,
        dia_vencimiento: this.data.dia_vencimiento,
        tipo_capita: this.data.tipo_capita,
        capita_empresa: this.data.capita_empresa,
        fecha_bon_perm: this.data.fecha_bon_perm,
        solicita_forma_pago: this.data.solicita_forma_pago,
        calcula_fecha_inicio_servicio: this.data.calcula_fecha_inicio_servicio,
        tipo_producto_vol_obl: this.data.tipo_producto_vol_obl,
        subsidio_corporativo: this.data.subsidio_corporativo,
        requiere_nro_form_sss: this.data.requiere_nro_form_sss,
        periodo_generacion_factura: this.data.periodo_generacion_factura,
        periodo_a_evaluar: this.data.periodo_a_evaluar,
        ultimo_periodo_liquidado: this.data.ultimo_periodo_liquidado,
        programa_recalculo: this.data.programa_recalculo,
        clasificador: this.data.clasificador,
      });
    }
  }

  public clear(inputElement: HTMLInputElement): void {
    inputElement.value = '';
  }

  public setElement(option: number): void {
    switch (option) {
      case 1:
        this.getProductoPrimario();
        break;
      case 2:
        this.getFuenteIngreso();
        break;
      case 3:
        this.getObraSocial();
        break;
      default:
        break;
    }
  }

  public setStatus(): void {
    if (this.data.fecha_baja_producto == 0) {
      this.data.fecha_baja_producto = this.date;
      this.status = true;
    } else {
      if (this.compareDate(this.data.fecha_baja_producto, this.date)) {
        this.data.fecha_baja_producto = 0;
        this.status = false;
      }
    }
  }

  private compareDate(date1: number, date2: number): boolean {
    const strDate1: string = date1.toString();
    const strDate2: string = date2.toString();

    const year1: number = Number(strDate1.slice(0, 4));
    const month1: number = Number(strDate1.slice(4, 6));
    const day1: number = Number(strDate1.slice(6, 8));

    const year2: number = Number(strDate2.slice(0, 4));
    const month2: number = Number(strDate2.slice(4, 6));
    const day2: number = Number(strDate2.slice(6, 8));

    if (year1 < year2) {
      return false;
    } else if (year1 === year2 && month1 < month2) {
      return false;
    } else if (year1 === year2 && month1 === month2 && day1 < day2) {
      return false;
    }

    return true;
  }

  private formatDate(date: Date): number {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return Number(`${year}${month}${day}`);
  }

  public redirectTo(url: string): void {
    this.productoService.set(this.data);
    this.router.navigate([url]);
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      codigo_producto: new UntypedFormControl(
        {
          value: this.data.codigo_producto,
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(4),
          isNumeric(),
        ])
      ),
      descripcion_producto: new UntypedFormControl(
        {
          value: this.data.descripcion_producto
            ? this.data.descripcion_producto.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ])
      ),
      descripcion_reducida: new UntypedFormControl(
        {
          value: this.data.descripcion_reducida
            ? this.data.descripcion_reducida.trim()
            : '',
          disabled: this.data.par_modo === 'R',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
          notOnlySpaces(),
        ])
      ),
      tipo_producto: new UntypedFormControl(
        {
          value: this.data.tipo_producto ? this.data.tipo_producto.trim() : '',
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.compose([Validators.required])
      ),
      descripcion_producto_administrador: new UntypedFormControl({
        value: this.data.descripcion_producto_administrador
          ? this.data.descripcion_producto_administrador.trim()
          : '',
        disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
      }),
      clase_producto: new UntypedFormControl(
        {
          value: this.data.clase_producto
            ? this.data.clase_producto.trim()
            : '',
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.compose([Validators.required])
      ),
      descripcion_fuente_ingreso: new UntypedFormControl(
        {
          value: this.data.descripcion_fuente_ingreso
            ? this.data.descripcion_fuente_ingreso
            : '',
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.compose([Validators.required])
      ),
      numero_empresa_factura: new UntypedFormControl(
        {
          value: this.data.numero_empresa_factura,
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.compose([Validators.required])
      ),
      descripcion_obra_social: new UntypedFormControl(
        {
          value: this.data.descripcion_obra_social
            ? this.data.descripcion_obra_social.trim()
            : '',
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.compose([Validators.required])
      ),
    });
  }

  private configureValidators(): void {
    this.formGroup.get('tipo_producto')?.valueChanges.subscribe((value) => {
      const descripcionProductoAdministradorControl = this.formGroup.get(
        'descripcion_producto_administrador'
      );

      if (value === 'S') {
        descripcionProductoAdministradorControl?.setValidators([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
          notOnlySpaces(),
        ]);
      } else {
        descripcionProductoAdministradorControl?.clearValidators();
      }

      descripcionProductoAdministradorControl?.updateValueAndValidity();
    });
  }

  private getProductoPrimario(): void {
    this.utilService.openLoading();
    this.productoService
      .CRUD(
        JSON.stringify({
          par_modo: 'P',
        })
      )
      .subscribe({
        next: (res: any) => {
          let datas: IProducto[] = Array.isArray(res.dataset)
            ? (res.dataset as IProducto[])
            : [res.dataset as IProducto];

          this.element = datas.map((data: IProducto) => {
            return {
              codigo: Number(data.codigo_fuente_ingreso),
              descripcion: String(data.descripcion_producto),
            };
          });
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          if (err.status == 0) {
            this.utilService.notification('Error de conexión.', 'error');
          } else {
            this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
          }
          if (err.status == 404) {
            this.element = [];
          }
        },
        complete: () => {
          this.utilService.closeLoading();
          this.setDialog(
            'SELECCIONE UN PRODUCTO ADMINISTRADOR',
            'Ingrese un producto',
            1,
            this.element
          );
        },
      });
  }

  private getFuenteIngreso(): void {
    this.utilService.openLoading();
    this.fuenteIngresoService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          descripcion: '',
          desc_empresa: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          let datas: IFuenteIngreso[] = Array.isArray(res.dataset)
            ? (res.dataset as IFuenteIngreso[])
            : [res.dataset as IFuenteIngreso];

          this.element = datas.map((data: IFuenteIngreso) => {
            return {
              codigo: Number(data.codigo_fuente_ingreso),
              descripcion: String(data.descripcion),
            };
          });
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          if (err.status == 0) {
            this.utilService.notification('Error de conexión.', 'error');
          } else {
            this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
          }
          if (err.status == 404) {
            this.element = [];
          }
        },
        complete: () => {
          this.utilService.closeLoading();
          this.setDialog(
            'SELECCIONE UNA FUENTE DE INGRESO',
            'Ingrese una fuente de ingreso',
            2,
            this.element
          );
        },
      });
  }

  private getObraSocial(): void {
    this.utilService.openLoading();
    this.productoService
      .CRUD(
        JSON.stringify({
          par_modo: 'S',
        })
      )
      .subscribe({
        next: (res: any) => {
          let datas: IProductoObraSocial[] = Array.isArray(res.dataset)
            ? (res.dataset as IProductoObraSocial[])
            : [res.dataset as IProductoObraSocial];

          this.element = datas.map((data: IProductoObraSocial) => {
            return {
              codigo: data.id_obrasocial,
              descripcion: data.descripcion,
            };
          });
          this.setDialog(
            'SELECCIONE UNA OBRA SOCIAL',
            'Ingrese una obra social',
            3,
            this.element
          );
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          if (err.status == 0) {
            this.utilService.notification('Error de conexión.', 'error');
          } else {
            this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
          }
          if (err.status == 404) {
            this.element = [];
          }
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }

  private setDialog(
    title: string,
    label: string,
    option: number,
    data: any
  ): void {
    const modal = this.dialog.open(SetProductoDialogComponent, {
      data: {
        title: title,
        label: label,
        option: option,
        element: data,
      },
    });

    modal.afterClosed().subscribe({
      next: (res: any) => {
        if (res) {
          switch (res.option) {
            case 1:
              this.data.producto_administrador = res?.codigo;
              this.data.descripcion_producto_administrador = res?.descripcion;
              this.formGroup
                .get('descripcion_producto_administrador')
                ?.setValue(res?.descripcion);
              break;
            case 2:
              this.data.codigo_fuente_ingreso = res?.codigo;
              this.data.descripcion_fuente_ingreso = res?.descripcion;
              this.formGroup
                .get('descripcion_fuente_ingreso')
                ?.setValue(res?.descripcion);
              break;
            case 3:
              this.data.codigo_obra_social = res?.codigo;
              this.data.descripcion_obra_social = res?.descripcion;
              this.formGroup
                .get('descripcion_obra_social')
                ?.setValue(res?.descripcion);
              break;
            default:
              break;
          }
        }
      },
    });
  }
}
