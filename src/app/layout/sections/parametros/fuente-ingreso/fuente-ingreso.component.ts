import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';

// * Interfaces
import { IFuenteIngreso } from 'src/app/core/models/fuente-ingreso.interface';
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';

// * Material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

// * Components
import { AddEditFuenteIngresoDialogComponent } from './components/add-edit-fuente-ingreso-dialog/add-edit-fuente-ingreso-dialog.component';
import { FuenteIngresoDashboardComponent } from './components/fuente-ingreso-dashboard/fuente-ingreso-dashboard.component';
import { EmpresaFacturaService } from 'src/app/core/services/empresa-factura.service';

@Component({
  selector: 'app-fuente-ingreso',
  templateUrl: './fuente-ingreso.component.html',
  styleUrls: ['./fuente-ingreso.component.scss'],
})
export class FuenteIngresoComponent {
  @ViewChild(FuenteIngresoDashboardComponent)
  dashboard: FuenteIngresoDashboardComponent;
  datosEmpresa: IEmpresaFactura[] = [];

  constructor(
    private utilService: UtilService,
    private dialog: MatDialog,
    private fuenteIngresoService: FuenteIngresoService,
    private empresaFacturaService: EmpresaFacturaService
  ) {}

  ngOnInit() {
    this.loadEmpresa();
  }

  public new(): void {
    const dialogRef = this.openDialog('CREAR FUENTE DE INGRESO', 'C', true);
    dialogRef.afterClosed().subscribe((res) => {
      this.performCRUD(
        res,
        'La fuente de ingreso se ha creado exitosamente.',
        dialogRef
      );
    });
  }

  public edit(data: IFuenteIngreso): void {
    const dialogRef = this.openDialog(
      'EDITAR FUENTE DE INGRESO',
      'U',
      true,
      data
    );
    dialogRef.afterClosed().subscribe((res) => {
      this.performCRUD(
        res,
        'La Empresa se ha editado exitosamente.',
        dialogRef
      );
    });
  }

  public view(data: IFuenteIngreso): void {
    console.log(data);

    this.openDialog('VER FUENTE DE INGRESO', 'R', false, data);
  }

  private openDialog(
    title: string,
    par_modo: string,
    edit: boolean,
    fuenteIngreso?: IFuenteIngreso
  ): MatDialogRef<AddEditFuenteIngresoDialogComponent, any> {
    return this.dialog.open(AddEditFuenteIngresoDialogComponent, {
      data: {
        title: title,
        edit: edit,
        par_modo: par_modo,
        codigo_fuente_ingreso: fuenteIngreso?.codigo_fuente_ingreso,
        tipo_fuente: fuenteIngreso?.tipo_fuente,
        codigo_fuente_admin: fuenteIngreso?.codigo_fuente_admin,
        descripcion: fuenteIngreso?.descripcion,
        descripcion_reducida: fuenteIngreso?.descripcion_reducida,
        solicita_ref: fuenteIngreso?.solicita_ref,
        dia_corte: fuenteIngreso?.dia_corte,
        empresa_asociada: fuenteIngreso?.empresa_asociada,
        nro_solicitud: fuenteIngreso?.nro_solicitud,
        fecha_ultima_liquidacion: fuenteIngreso?.fecha_ultima_liquidacion,
        aporte_adicional: fuenteIngreso?.aporte_adicional,
        fuente_aporte_adicional: fuenteIngreso?.fuente_aporte_adicional,
        concepto_aporte_adicional: fuenteIngreso?.concepto_aporte_adicional,
        controla_dec_jur: fuenteIngreso?.controla_dec_jur,
        comprobante_general: fuenteIngreso?.comprobante_general,
        condicion_venta: fuenteIngreso?.condicion_venta,
        sub_prog_calc: fuenteIngreso?.sub_prog_calc,
        ref_contable_asociada: fuenteIngreso?.ref_contable_asociada,
        concepto_aporte: fuenteIngreso?.concepto_aporte,
        concepto_arancel: fuenteIngreso?.concepto_arancel,
        agrupa_entidades: fuenteIngreso?.agrupa_entidades,
        grupo_familiar_imprimir: fuenteIngreso?.grupo_familiar_imprimir,
        numeracion_auto: fuenteIngreso?.numeracion_auto,
        talonario: fuenteIngreso?.talonario,
        liquida_punitorio: fuenteIngreso?.liquida_punitorio,
        liquida_reintegro: fuenteIngreso?.liquida_reintegro,
        liquida_planes_mix: fuenteIngreso?.liquida_planes_mix,
        liquida_planes_monotributo: fuenteIngreso?.liquida_planes_monotributo,
        selecciona_productos_liq: fuenteIngreso?.selecciona_productos_liq,
        condicion_aporte_adic_dec: fuenteIngreso?.condicion_aporte_adic_dec,
        agrupador_capita: fuenteIngreso?.agrupador_capita,
        liquidacion_mensual: fuenteIngreso?.liquidacion_mensual,
        condicion_venta_venc: fuenteIngreso?.condicion_venta_venc,
        condicion_venta_dos_venc: fuenteIngreso?.condicion_venta_dos_venc,
        datosEmpresa: this.datosEmpresa,
      },
    });
  }
  private performCRUD(
    data: any,
    successMessage: string,
    dialogRef: MatDialogRef<any, any>
  ): void {
    if (data) {
      this.utilService.openLoading();
      this.fuenteIngresoService.CRUD(data).subscribe({
        next: () => {
          this.utilService.notification(successMessage, 'success');
          dialogRef.close();
          let body = {
            par_modo: 'O',
            descripcion: data.descripcion,
            desc_empresa: '',
          };
          this.dashboard.getFuenteIngreso(body);
        },
        error: (err: any) => {
          dialogRef.close();
          this.edit(data);
          err.status == 0
            ? this.utilService.notification('Error de conexión. ', 'error')
            : this.utilService.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
                'error'
              );
        },
        complete: () => {
          dialogRef.close();
          setTimeout(() => {}, 300);
        },
      });
    }
  }

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  loadEmpresa() {
    this.utilService.openLoading();
    this.empresaFacturaService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          descripcion: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.datosEmpresa = res.dataset;
          if (this.fuenteIngresoService.getBack()) {
            if (this.fuenteIngresoService.get()) {
              let fuente = this.fuenteIngresoService.get();
              this.edit(fuente);
            }
          }
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          err.status === 0
            ? this.utilService.notification('Error de conexión.', 'error')
            : this.utilService.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                'error'
              );
          if (err.status == 404) this.datosEmpresa = [];
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }
}
