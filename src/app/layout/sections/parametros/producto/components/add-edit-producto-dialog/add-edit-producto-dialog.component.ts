import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ProductoService } from 'src/app/core/services/producto.service';
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';
import { UnificacionAporteProductoService } from 'src/app/core/services/unificacion-aporte-producto.service';

// * Interfaces
import { IFuenteIngreso } from 'src/app/core/models/fuente-ingreso.interface';
import {
  IProducto,
  IProductoObraSocial,
} from 'src/app/core/models/producto.interface';
import { IUnificacionAporteProducto } from 'src/app/core/models/unificacion-aporte-producto.interface';

// * Form
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validations
import {
  getErrorMessage,
  isAlpha,
  isNumeric,
  notOnlySpaces,
} from 'src/app/core/validators/character.validator';

// * Material
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

// * Components
import { SetProductoPrimarioDialogComponent } from './set-producto-primario-dialog/set-producto-primario-dialog.component';
import { SetFuenteIngresoDialogComponent } from './set-fuente-ingreso-dialog/set-fuente-ingreso-dialog.component';
import { SetObraSocialDialogComponent } from './set-obra-social-dialog/set-obra-social-dialog.component';

@Component({
  selector: 'app-add-edit-producto-dialog',
  templateUrl: './add-edit-producto-dialog.component.html',
  styleUrls: ['./add-edit-producto-dialog.component.scss'],
})
export class AddEditProductoDialogComponent {
  private element: any[];
  private date: number;
  public getErrorMessage = getErrorMessage;
  public formGroup: UntypedFormGroup;
  public visibilidad: boolean = false;
  public estado: boolean = false;

  constructor(
    private dataSharingService: DataSharingService,
    private fuenteIngresoService: FuenteIngresoService,
    private productoService: ProductoService,
    private unificacionAporteProductoService: UnificacionAporteProductoService,
    private utilService: UtilService,
    private dialog: MatDialog,
    private router: Router,
    private dialogRef: MatDialogRef<AddEditProductoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
    this.configureValidators();
    this.configureButton();
  }

  public confirm(): void {
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
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public clear(inputElement: HTMLInputElement, controlName: string): void {
    inputElement.value = '';
    this.formGroup.get(controlName)?.setValue('');
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
    if (this.formGroup.valid) {
      this.data.par_modo = 'D';
      if (this.data.fecha_baja_producto === 0) {
        this.data.fecha_baja_producto = this.date;
      } else {
        if (this.compareDate(this.data.fecha_baja_producto, this.date)) {
          this.data.fecha_baja_producto = 0;
        }
      }
      this.confirm();
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public redirectTo(url: string): void {
    this.productoService.set(this.data);
    this.router.navigate([url]);
  }

  public redirectToUnificacionAporteProducto(): void {
    this.utilService.openLoading();
    this.unificacionAporteProductoService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          producto_principal: this.data.producto_administrador,
          subproducto_principal: this.data.codigo_producto,
        })
      )
      .subscribe({
        next: (res: any) => {
          let data: IUnificacionAporteProducto[] = Array.isArray(res.dataset)
            ? (res.dataset as IUnificacionAporteProducto[])
            : [res.dataset as IUnificacionAporteProducto];
          this.unificacionAporteProductoService.set(data);
          this.productoService.set(this.data);
          this.dialogRef.close();
          this.router.navigate(['parametros/unificacion-aportes-producto']);
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          if (err.status == 0) {
            this.utilService.notification('Error de conexión.', 'error');
          } else {
            if (err.status == 404) {
              this.unificacionAporteProductoService.set([]);
              this.utilService.notification(
                'No se han encontrado unificación de aportes por producto. ',
                'error'
              );
            } else {
              this.utilService.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                'error'
              );
            }
          }
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }

  private configureButton(): void {
    if (this.data.par_modo === 'U') {
      this.date = this.formatDate(new Date());
      if (
        this.data.fecha_baja_producto === 0 ||
        this.compareDate(this.data.fecha_baja_producto, this.date)
      ) {
        this.visibilidad = true;
      }
      if (this.data.fecha_baja_producto === 0) {
        this.estado = true;
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

    if (
      date1 === date2 ||
      (year1 === year2 && month1 === month2 && day1 === day2 - 1)
    ) {
      return true;
    } else {
      return false;
    }
  }

  private formatDate(date: Date): number {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return Number(`${year}${month}${day}`);
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
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlpha(),
        ])
      ),
      descripcion_producto_administrador: new UntypedFormControl(
        {
          value: this.data.descripcion_producto_administrador
            ? this.data.descripcion_producto_administrador.trim()
            : '',
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          notOnlySpaces(),
        ])
      ),
      clase_producto: new UntypedFormControl(
        {
          value: this.data.clase_producto
            ? this.data.clase_producto.trim()
            : '',
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ])
      ),
      descripcion_fuente_ingreso: new UntypedFormControl(
        {
          value: this.data.descripcion_fuente_ingreso
            ? this.data.descripcion_fuente_ingreso
            : '',
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          notOnlySpaces(),
        ])
      ),
      numero_empresa_factura: new UntypedFormControl(
        {
          value: this.data.numero_empresa_factura,
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.minLength(8),
          notOnlySpaces(),
        ])
      ),
      descripcion_obra_social: new UntypedFormControl(
        {
          value: this.data.descripcion_obra_social
            ? this.data.descripcion_obra_social.trim()
            : '',
          disabled: this.data.par_modo === 'R' || this.data.par_modo === 'U',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          notOnlySpaces(),
        ])
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
    this.element = [];
    this.utilService.openLoading();
    this.productoService
      .CRUD(
        JSON.stringify({
          par_modo: 'P',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.element = Array.isArray(res.dataset)
            ? (res.dataset as IProducto[])
            : [res.dataset as IProducto];
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          err.status == 0
            ? this.utilService.notification('Error de conexión. ', 'error')
            : this.utilService.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                'error'
              );
        },
        complete: () => {
          this.utilService.closeLoading();
          this.setProductoPrimario(this.element);
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
          let data: IFuenteIngreso[] = Array.isArray(res.dataset)
            ? (res.dataset as IFuenteIngreso[])
            : [res.dataset as IFuenteIngreso];
          this.setFuenteIngreso(data);
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          err.status == 0
            ? this.utilService.notification('Error de conexión. ', 'error')
            : this.utilService.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                'error'
              );
        },
        complete: () => {
          this.utilService.closeLoading();
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
          let data: IProductoObraSocial[] = Array.isArray(res.dataset)
            ? (res.dataset as IProductoObraSocial[])
            : [res.dataset as IProductoObraSocial];
          this.setObraSocial(data);
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          err.status == 0
            ? this.utilService.notification('Error de conexión. ', 'error')
            : this.utilService.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                'error'
              );
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }

  private setProductoPrimario(data: IProducto[]): void {
    const modal = this.dialog.open(SetProductoPrimarioDialogComponent, {
      data: {
        title: 'SELECCIONE UN PRODUCTO ADMINISTRADOR',
        data: data,
      },
    });
    modal.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.producto_administrador = res?.codigo_producto;
          this.data.descripcion_producto_administrador =
            res?.descripcion_producto;
          this.formGroup
            .get('descripcion_producto_administrador')
            ?.setValue(res?.descripcion_producto);
        }
      },
    });
  }

  private setFuenteIngreso(data: IFuenteIngreso[]): void {
    const modal = this.dialog.open(SetFuenteIngresoDialogComponent, {
      data: {
        title: 'SELECCIONE UNA FUENTE DE INGRESO',
        data: data,
      },
    });
    modal.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.codigo_fuente_ingreso = res?.codigo_fuente_ingreso;
          this.data.descripcion_fuente_ingreso = res?.descripcion;
          this.formGroup
            .get('descripcion_fuente_ingreso')
            ?.setValue(res?.descripcion);
        }
      },
    });
  }

  private setObraSocial(data: IProductoObraSocial[]): void {
    const modal = this.dialog.open(SetObraSocialDialogComponent, {
      data: {
        title: 'SELECCIONE UNA OBRA SOCIAL',
        data: data,
      },
    });
    modal.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.codigo_obra_social = res?.id_obrasocial;
          this.data.descripcion_obra_social = res?.descripcion;
          this.formGroup
            .get('descripcion_obra_social')
            ?.setValue(res?.descripcion);
        }
      },
    });
  }
}
