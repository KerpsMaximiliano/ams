import { Component, Inject, OnInit } from '@angular/core';

// * Services
import { DataSharingService } from 'src/app/core/services/data-sharing.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';
import { ProductoService } from 'src/app/core/services/producto.service';
import { MvmtsNovedadesAutoService } from 'src/app/core/services/mvmts-novedades-auto.service';
import { MotivoMovimientoService } from 'src/app/core/services/motivo-movimiento.service';

// * Interfaces
import { IProductoAdministrador } from 'src/app/core/models/producto-administrador.interface';
import { IPlan } from 'src/app/core/models/mvmts-novedades-auto.interface';
import { IFuenteIngreso } from 'src/app/core/models/fuente-ingreso.interface';

// * Forms
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// * Validators
import {
  getErrorMessage,
  isAlphanumericWithSpaces,
  isNumeric,
} from 'src/app/core/validators/character.validator';

// * Material
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

// * Components
import { SetProdSubDialogComponent } from '../set-producto-dialog/set-producto-dialog.component';
import { ConfirmDialogComponent } from 'src/app/layout/sections/components/confirm-dialog/confirm-dialog.component';
import { SetMotivoMovimientoDialogComponent } from './set-motivo-movimiento-dialog/set-motivo-movimiento-dialog.component';
import { SetPlanDialogComponent } from './set-plan-dialog/set-plan-dialog.component';
import { FuenteIngresoSetDialogComponent } from '../set-fuente-ingreso-dialog/set-fuente-ingreso-dialog.component';
import { IMotivoMovimiento } from 'src/app/core/models/motivo-movimiento.interface';

@Component({
  selector: 'app-add-edit-mvmts-novedades-auto-dialog',
  templateUrl: './add-edit-mvmts-novedades-auto-dialog.component.html',
  styleUrls: ['./add-edit-mvmts-novedades-auto-dialog.component.scss'],
})
export class AddEditMvmtsNovedadesAutoDialogComponent {
  public getErrorMessage = getErrorMessage;
  public formGroup: UntypedFormGroup;
  public activeTabIndex = 0;
  public visibilidad: boolean = false;
  movimientos = [
    'ALTA',
    'BAJA',
    'MODIFICACIÓN',
    'REHABILITACIÓN',
    'SUSPENSIÓN',
  ];

  constructor(
    private dataSharingService: DataSharingService,
    private fuenteIngresoService: FuenteIngresoService,
    private movimientoService: MotivoMovimientoService,
    private mvmtsNovedadesService: MvmtsNovedadesAutoService,
    private productoService: ProductoService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private utilService: UtilService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.setUpForm();
  }

  public nextStep(): void {
    if (this.activeTabIndex !== 3) {
      this.activeTabIndex += 1;
    }
  }

  public prevStep(): void {
    if (this.activeTabIndex !== 0) {
      this.activeTabIndex -= 1;
    }
  }

  public tabChanged(event: MatTabChangeEvent): void {
    this.activeTabIndex = event.index;
  }

  public clearInput(input: string) {
    switch (input) {
      case 'producto_origen':
        this.limpiar(1);
        break;
      case 'producto_relacionado':
        this.limpiar(2);
        break;
      case 'capita_origen':
        this.formGroup.get(input)?.setValue(undefined);
        this.data.capita_origen = undefined;
        break;
      case 'capita_rel':
        this.formGroup.get(input)?.setValue(undefined);
        this.data.capita_rel = undefined;
        break;
      case 'plan_origen':
        this.limpiar(3);
        break;
      case 'codigo_motivo':
        this.formGroup.get(input)?.setValue(undefined);
        this.data.codigo_motivo = undefined;
        break;
      default:
        this.formGroup.get(input)?.setValue(undefined);
        break;
    }
    return;
  }

  public limpiar(number: number) {
    switch (number) {
      case 1:
        this.formGroup.get('producto_origen')?.setValue(undefined);
        this.data.producto_origen = undefined;
        this.formGroup.get('sub_producto_origen')?.setValue(undefined);
        this.data.sub_producto_origen = undefined;
        break;
      case 2:
        this.formGroup.get('producto_relacionado')?.setValue(undefined);
        this.data.producto_relacionado = undefined;
        this.formGroup.get('sub_prod_rel')?.setValue(undefined);
        this.data.sub_prod_rel = undefined;
        break;
      case 3:
        this.formGroup.get('plan_origen')?.setValue(undefined);
        this.data.plan_origen = undefined;
        break;
      case 4:
        this.formGroup.get('plan_cambio')?.setValue(undefined);
        this.data.plan_cambio = undefined;
        break;
      case 5:
        this.formGroup.get('codigo_motivo')?.setValue(undefined);
        this.data.codigo_motivo = undefined;
        break;
    }
  }

  public confirm(): void {
    if (this.formGroup.valid) {
      this.dataSharingService.sendData({
        par_modo: this.data.par_modo,
        capita_origen: this.data.capita_origen,
        producto_origen: this.data.producto_origen,
        sub_producto_origen: this.data.sub_producto_origen,
        plan_origen: this.data.plan_origen ? this.data.plan_origen : '',
        mov_origen: this.formGroup.get('mov_origen')?.value,
        monotributo: this.formGroup.get('monotributo')?.value,
        capita_rel: this.data.capita_rel,
        sec_prod_rel: this.data.sec_prod_rel,
        producto_relacionado: this.data.producto_relacionado,
        sub_prod_rel: this.data.sub_prod_rel,
        movimiento_rel: this.formGroup.get('movimiento_rel')?.value,
        novedad_vinculo: this.formGroup.get('novedad_vinculo')?.value,
        clase_prod: this.formGroup.get('clase_prod')?.value,
        plan_cambio: this.data.plan_cambio ? this.data.plan_cambio : '',
        opcion_monotributo: this.formGroup.get('opcion_monotributo')?.value,
        codigo_motivo: this.data.codigo_motivo,
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public getFuenteIngreso(): void {
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

  public getProducto(): void {
    this.utilService.openLoading();
    this.productoService
      .CRUD(
        JSON.stringify({
          par_modo: 'F',
          codigo_fuente_ingreso: this.data.capita_origen,
        })
      )
      .subscribe({
        next: (res: any) => {
          let data: IProductoAdministrador[] = Array.isArray(res.dataset)
            ? (res.dataset as IProductoAdministrador[])
            : [res.dataset as IProductoAdministrador];
          this.setProducto(data);
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

  public getPlan(): void {
    this.utilService.openLoading();
    this.mvmtsNovedadesService
      .CRUD(
        JSON.stringify({
          par_modo: 'P',
          producto_origen: this.data.producto_origen,
        })
      )
      .subscribe({
        next: (res: any) => {
          let data: IPlan[] = Array.isArray(res.dataset)
            ? (res.dataset as IPlan[])
            : [res.dataset as IPlan];
          this.setPlan(data);
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

  public getFuenteIngresoRel(): void {
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
          this.setFuenteIngresoRel(data);
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

  public getProductoRel(): void {
    this.utilService.openLoading();
    this.productoService
      .CRUD(
        JSON.stringify({
          par_modo: 'F',
          codigo_fuente_ingreso: this.data.capita_rel,
        })
      )
      .subscribe({
        next: (res: any) => {
          let data: IProductoAdministrador[] = Array.isArray(res.dataset)
            ? (res.dataset as IProductoAdministrador[])
            : [res.dataset as IProductoAdministrador];
          this.setProductoRel(data);
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

  public getMovimientos(): void {
    this.utilService.openLoading();
    this.movimientoService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          tipo_motivo: this.formGroup.get('movimiento_rel')?.value,
          descripcion: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          let data: IMotivoMovimiento[] = Array.isArray(res.dataset)
            ? (res.dataset as IMotivoMovimiento[])
            : [res.dataset as IMotivoMovimiento];
          this.setMotivoMovimiento(data);
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          err.status == 0
            ? this.utilService.notification('Error de conexión. ', 'error')
            : err.status == 404
            ? this.utilService.notification(
                `No existe un motivo de movimiento con el movimiento seleccionado`,
                'error'
              )
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

  public getPlanRel(): void {
    this.utilService.openLoading();
    this.mvmtsNovedadesService
      .CRUD(
        JSON.stringify({
          par_modo: 'P',
          producto_origen: this.data.producto_relacionado,
        })
      )
      .subscribe({
        next: (res: any) => {
          let data: IPlan[] = Array.isArray(res.dataset)
            ? (res.dataset as IPlan[])
            : [res.dataset as IPlan];
          this.setPlanCambio(data);
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

  private setFuenteIngreso(data: IFuenteIngreso[]) {
    const modalCapita = this.dialog.open(FuenteIngresoSetDialogComponent, {
      data: {
        title: 'SELECCIONE UNA FUENTE DE INGRESO',
        data: data,
      },
    });
    modalCapita.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.capita_origen = res.codigo_fuente_ingreso;
          this.formGroup
            .get('capita_origen')
            ?.setValue(res.descripcion ? res.descripcion.trim() : ' ');
        }
      },
    });
  }

  private setMotivoMovimiento(data: IMotivoMovimiento[]) {
    const modalSetProd = this.dialog.open(SetMotivoMovimientoDialogComponent, {
      data: {
        title: 'SELECCIONE UN MOTIVO DE MOVIMIENTO',
        data: data,
      },
    });
    modalSetProd.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.codigo_motivo = res.id_motivo;
          this.formGroup
            .get('codigo_motivo')
            ?.setValue(
              res.descripcion ? res.descripcion.trim() : res.id_motivo
            );
        }
      },
    });
  }

  private setProducto(data: IProductoAdministrador[]) {
    const modalSetProd = this.dialog.open(SetProdSubDialogComponent, {
      data: {
        title: 'SELECCIONE PRODUCTO/SUBPRODUCTO',
        data: data,
      },
    });
    modalSetProd.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.producto_origen = res.producto_administrador
            ? res.producto_administrador
            : res.codigo_producto || 0;
          this.formGroup
            .get('producto_origen')
            ?.setValue(
              res.descripcion_producto_administrador
                ? res.descripcion_producto_administrador.trim()
                : res.descripcion_producto.trim() || ''
            );

          this.data.sub_producto_origen = res.producto_administrador
            ? res.codigo_producto || 0
            : 0;
          this.formGroup
            .get('sub_producto_origen')
            ?.setValue(
              res.descripcion_producto_administrador
                ? res.descripcion_producto.trim() || ''
                : ''
            );
        }
      },
    });
  }

  private setPlan(data: IPlan[]) {
    const modalPlan = this.dialog.open(SetPlanDialogComponent, {
      data: {
        title: 'SELECCIONE UN PLAN',
        data: data,
      },
    });
    modalPlan.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.plan_origen = res.plan ? res.plan.trim() : res.plan;
          res.plan.trim().length > 0 && res.descripcion.trim().length > 0
            ? this.formGroup
                .get('plan_origen')
                ?.setValue(res.plan.trim() + ' - ' + res.descripcion.trim())
            : this.formGroup
                .get('plan_origen')
                ?.setValue(
                  res.plan.value > 0 ? res.plan.trim() : res.descripcion
                );
        }
      },
    });
  }

  private setFuenteIngresoRel(data: IFuenteIngreso[]) {
    const modalCapita2 = this.dialog.open(FuenteIngresoSetDialogComponent, {
      data: {
        title: 'SELECCIONE UNA FUENTE DE INGRESO',
        data: data,
      },
    });
    modalCapita2.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.capita_rel = res.codigo_fuente_ingreso;
          this.formGroup.get('capita_rel')?.setValue(res.descripcion);
        }
      },
    });
  }

  private setProductoRel(data: IProductoAdministrador[]) {
    const modalSetProd2 = this.dialog.open(SetProdSubDialogComponent, {
      data: {
        title: 'SELECCIONE PRODUCTO/SUBPRODUCTO',
        data: data,
      },
    });
    modalSetProd2.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.producto_relacionado = res.producto_administrador
            ? res.producto_administrador
            : res.codigo_producto || 0;
          this.formGroup
            .get('producto_relacionado')
            ?.setValue(
              res.descripcion_producto_administrador
                ? res.descripcion_producto_administrador.trim()
                : res.descripcion_producto.trim() || ''
            );

          this.data.sub_prod_rel = res.producto_administrador
            ? res.codigo_producto || 0
            : 0;
          this.formGroup
            .get('sub_prod_rel')
            ?.setValue(
              res.descripcion_producto_administrador
                ? res.descripcion_producto.trim() || ''
                : ''
            );
        }
      },
    });
  }

  private setPlanCambio(data: IPlan[]) {
    const modalPlan2 = this.dialog.open(SetPlanDialogComponent, {
      data: {
        title: 'SELECCIONE UN PLAN CAMBIO',
        data: data,
      },
    });
    modalPlan2.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.data.plan_cambio = res.plan ? res.plan.trim() : res.plan;
          this.formGroup.get('plan_cambio')?.setValue(res.descripcion);
        }
      },
    });
  }

  private setUpForm(): void {
    this.formGroup = new UntypedFormGroup({
      capita_origen: new UntypedFormControl(
        {
          value: this.data.nombre_fuente
            ? this.data.nombre_fuente.trim()
            : this.data.capita_origen,
          disabled: this.data.par_modo !== 'C',
        },
        Validators.compose([Validators.required])
      ),
      // Producto
      producto_origen: new UntypedFormControl(
        {
          value: this.data.nombre_prod
            ? this.data.nombre_prod.trim()
            : this.data.producto_origen,
          disabled: this.data.par_modo !== 'C',
        },
        Validators.compose([Validators.required])
      ),
      // Subproducto
      sub_producto_origen: new UntypedFormControl({
        value: this.data.nombre_sub_prod
          ? this.data.nombre_sub_prod.trim()
          : '',
        disabled: this.data.par_modo !== 'C',
      }),
      // Plan
      plan_origen: new UntypedFormControl(
        {
          value: this.data.nombre_plan ? this.data.plan_origen.trim() : '',
          disabled: this.data.par_modo !== 'C',
        },
        Validators.compose([Validators.required])
      ),
      // Tipo de Movimiento
      mov_origen: new UntypedFormControl(
        {
          value: this.data.mov_origen ? this.data.mov_origen.trim() : '',
          disabled: this.data.par_modo !== 'C',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
      // Monotributo
      monotributo: new UntypedFormControl(
        {
          value: this.data.monotributo ? this.data.monotributo.trim() : '',
          disabled: this.data.par_modo !== 'C',
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
        ])
      ),
      // Fuente de Ingreso 2
      capita_rel: new UntypedFormControl(
        {
          value: this.data.nombre_fuente_rel,
          disabled: this.data.par_modo !== 'C',
        },
        Validators.compose([Validators.required])
      ),
      // Secuencia
      sec_prod_rel: new UntypedFormControl({
        value: this.data.sec_prod_rel,
        disabled: this.data.par_modo !== 'C',
      }),
      // Producto 2
      producto_relacionado: new UntypedFormControl(
        { value: this.data.nombre_prod_rel, disabled: !this.data.edit },
        Validators.compose([Validators.required])
      ),
      // Subproducto 2
      sub_prod_rel: new UntypedFormControl({
        value: this.data.nombre_sub_prod_rel
          ? this.data.nombre_sub_prod_rel
          : this.data.sub_prod_rel,
        disabled: !this.data.edit,
      }),
      // Movimiento
      movimiento_rel: new UntypedFormControl(
        {
          value: this.data.movimiento_rel
            ? this.data.movimiento_rel.trim()
            : '',
          disabled: !this.data.edit,
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
      // Novedad de Vinculo
      novedad_vinculo: new UntypedFormControl(
        {
          value: this.data.novedad_vinculo
            ? this.data.novedad_vinculo.trim()
            : '',
          disabled: !this.data.edit,
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1),
          isAlphanumericWithSpaces(),
        ])
      ),
      // Clase de producto
      clase_prod: new UntypedFormControl(
        {
          value: this.data.clase_prod ? this.data.clase_prod.trim() : '',
          disabled: !this.data.edit,
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
        ])
      ),
      // Plan
      plan_cambio: new UntypedFormControl(
        {
          value: this.data.plan_cambio ? this.data.plan_cambio.trim() : '',
          disabled: !this.data.edit,
        },
        Validators.compose([Validators.required])
      ),
      // Opcion monotributo
      opcion_monotributo: new UntypedFormControl(
        { value: this.data.opcion_monotributo, disabled: !this.data.edit },
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          isNumeric(),
        ])
      ),
      // Motivo
      codigo_motivo: new UntypedFormControl(
        { value: this.data.desc_motivo, disabled: !this.data.edit },
        Validators.compose([Validators.required])
      ),
    });
  }

  public textTransform(value: string, posicion: number) {
    if (posicion === 1) {
      switch (value) {
        case 'A':
          return 'ALTA';
        case 'B':
          return 'BAJA';
        case 'M':
          return 'MODIFICACIÓN';
        case 'R':
          return 'REHABILITACIÓN';
        case 'S':
          return 'SUSPENSIÓN';
        case ' ':
          return 'NADA';
        case '0':
          return 'AFILIACIÓN NORMAL';
        case '1':
          return 'MONOTRIBUTISTAS SIN OPCIÓN DE CAMBIO';
        case '2':
          return 'MONOTRIBUTISTAS CON OPCIÓN DE CAMBIO A PREPAGA';
        default:
          return 'S/N';
      }
    } else {
      switch (value) {
        case 'L':
          return 'CUOTA SOCIAL';
        case 'S':
          return 'SALUD';
        case 'B':
          return 'SUBSIDIO';
        case 'G':
          return 'SUBSIDIO QUIRÚRGICO';
        case 'V':
          return 'VIDA';
        case 'O':
          return 'EMERGENCIA';
        default:
          return 'S/N';
      }
    }
  }
}
