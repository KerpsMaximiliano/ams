import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';

// * Interfaces
import {
  IFuenteIngreso,
  IFuenteIngresoResponse,
} from 'src/app/core/models/fuente-ingreso.interface';
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AddEditFuenteIngresoDialogComponent } from './components/add-edit-fuente-ingreso-dialog/add-edit-fuente-ingreso-dialog.component';
import {
  FuenteIngresoDashboardComponent
} from './components/fuente-ingreso-dashboard/fuente-ingreso-dashboard.component';
import { EmpresaFacturaService } from 'src/app/core/services/empresa-factura.service';

@Component({
  selector: 'app-fuente-ingreso',
  templateUrl: './fuente-ingreso.component.html',
  styleUrls: ['./fuente-ingreso.component.scss'],
})
export class FuenteIngresoComponent {
  @ViewChild(FuenteIngresoDashboardComponent)
  dashboard: FuenteIngresoDashboardComponent;
  fuentesingreso$: Observable<IFuenteIngresoResponse>;
  datosEmpresa: IEmpresaFactura[] = [];

  constructor(
    private utilService: UtilService,
    private dialog: MatDialog,
    private fuenteIngresoService: FuenteIngresoService,
    private empresaFacturaService: EmpresaFacturaService
  ) {
    this.loadEmpresa();
  }

  ngOnInit() {}

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

  public nuevaFuenteIngreso(fuenteIngreso?: IFuenteIngreso): void {
    const modalNuevoFuenteIngreso = this.dialog.open(
      AddEditFuenteIngresoDialogComponent,
      {
        data: {
          title: `NUEVA FUENTE DE INGRESO`,
          edit: true,
          par_modo: 'C',
          codigo_fuente_ingreso: fuenteIngreso?.codigo_fuente_ingreso,
          tipo_fuente: fuenteIngreso?.tipo_fuente,
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
      }
    );

    modalNuevoFuenteIngreso.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utilService.openLoading();
          this.fuenteIngresoService.CRUD(res).subscribe({
            next: (res: any) => {
              this.utilService.notification(
                'La fuente de ingreso se ha creado exitosamente. ',
                'success'
              );
            },
            error: (err: any) => {
              this.utilService.closeLoading();
              err.status == 0
                ? this.utilService.notification('Error de conexión. ', 'error')
                : this.utilService.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                    'error'
                  );
              this.nuevaFuenteIngreso(res);
            },
            complete: () => {
              this.utilService.closeLoading();
              setTimeout(() => {
                let body = {
                  par_modo: 'R',
                  codigo_fuente_ingreso: res.codigo_fuente_ingreso,
                };
                this.dashboard.getFuenteIngreso(body);
              }, 300);
            },
          });
        }
      },
    });
  }
}
