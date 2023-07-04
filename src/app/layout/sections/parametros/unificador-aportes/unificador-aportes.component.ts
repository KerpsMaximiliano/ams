import { Component, ViewChild } from '@angular/core';
// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { unificacionAporteService } from 'src/app/core/services/unificacion-aportes.service';
// * Interfaces
import { IUnificacionAporte } from 'src/app/core/models/unificacion-aportes.interface';
// * Material
import { MatDialog } from '@angular/material/dialog';
// * Components
import { AddEditUnificadorAporteComponent } from './components/add-edit-unificador-aporte/add-edit-unificador-aporte.component';
import { UnificadorAporteDashboardComponent } from './components/unificador-aporte-dashboard/unificador-aporte-dashboard.component';
@Component({
  selector: 'app-unificador-aportes',
  templateUrl: './unificador-aportes.component.html',
  styleUrls: ['./unificador-aportes.component.scss'],
})
export class UnificadorAportesComponent {
  @ViewChild(UnificadorAporteDashboardComponent)
  dashboard: UnificadorAporteDashboardComponent;
  producto: any;
  constructor(
    private unificacionAporteService: unificacionAporteService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {
    this.producto = this.unificacionAporteService.get();
  }

  ngOnInit(): void {}

  public handleSearch(): void {
    this.dashboard.filter();
  }

  public nuevaUnificacionAportes(UnificacionAporte?: IUnificacionAporte): void {
    const modalNuevoUnificacionAportes = this.dialog.open(
      AddEditUnificadorAporteComponent,
      {
        data: {
          title: `CREAR UNIFICACIÓN DE APORTE`,
          edit: true,
          par_modo: 'I',
          producto_principal_cod: this.producto?.codigo_producto,
          producto_principal: this.producto?.descripcion_producto,
          subproducto_principal_cod: this.producto?.codigo_producto_sub,
          subproducto_principal: this.producto?.descripcion_producto_sub,
          producto_secundario: UnificacionAporte?.producto_secundario,
          producto_secundario_cod: UnificacionAporte?.producto_secundario_cod,
          subproducto_secundario: UnificacionAporte?.subproducto_secundario,
          subproducto_secundario_cod:
            UnificacionAporte?.subproducto_secundario_cod,
          unifica_aporte: 'S',
        },
      }
    );

    modalNuevoUnificacionAportes.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.unificacionAporteService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La unificación se ha creado exitosamente',
                'success'
              );
            },
            error: (err) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión. ', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                    'error'
                  );
              this.nuevaUnificacionAportes(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch();
              }, 300);
            },
          });
        }
      },
    });
  }
}
