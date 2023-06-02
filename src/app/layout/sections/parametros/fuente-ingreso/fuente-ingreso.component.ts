import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FuenteIngreso, FuenteIngresoResponse } from 'src/app/core/models/fuente-ingreso.interface';
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditFuenteIngresoDialogComponent } from './components/add-edit-fuente-ingreso-dialog/add-edit-fuente-ingreso-dialog.component';
import { FuenteIngresoDashboardComponent, searchValue } from './components/fuente-ingreso-dashboard/fuente-ingreso-dashboard.component';

@Component({
  selector: 'app-fuente-ingreso',
  templateUrl: './fuente-ingreso.component.html',
  styleUrls: ['./fuente-ingreso.component.scss']
})
export class FuenteIngresoComponent {

  @ViewChild(FuenteIngresoDashboardComponent) dashboard: FuenteIngresoDashboardComponent;
  fuentesingreso$: Observable<FuenteIngresoResponse>
  empresas$: Observable<any>


  constructor(private fuenteIngresoService: FuenteIngresoService,
    private utils: UtilService,
    private dialog: MatDialog,
    ) {}

  ngOnInit(): void {
  }

  public handleSearch(inputValue: searchValue): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaFuenteIngreso(fuenteIngreso?:FuenteIngreso): void {
    const modalNuevoFuenteIngreso = this.dialog.open(AddEditFuenteIngresoDialogComponent, {
      data: {
        title: `Nueva Fuente de Ingreso`,
        edit: true,
        par_modo: 'I',
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
        comprobante_general:fuenteIngreso?.comprobante_general,
        condicion_venta: fuenteIngreso?.condicion_venta,
        sub_prog_calc:fuenteIngreso?.sub_prog_calc,
        ref_contable_asociada:fuenteIngreso?.ref_contable_asociada,
        concepto_aporte: fuenteIngreso?.concepto_aporte,
        concepto_arancel: fuenteIngreso?.concepto_arancel,
        agrupa_entidades: fuenteIngreso?.agrupa_entidades,
        grupo_familiar_imprimir:fuenteIngreso?.grupo_familiar_imprimir,
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
      }
    });

    modalNuevoFuenteIngreso.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          console.log(res);
          
          this.utils.openLoading();
          this.fuenteIngresoService.fuenteIngresoCRUD(res).subscribe({
            next: (res) => {
              this.utils.notification("La Fuente Ingreso se ha creado exitosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              console.log(err);
              
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error') 
                : this.utils.notification(`Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`, 'error')
              this.nuevaFuenteIngreso(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
              }, 300);
            }
          });
        }
      }
    })
  }
}