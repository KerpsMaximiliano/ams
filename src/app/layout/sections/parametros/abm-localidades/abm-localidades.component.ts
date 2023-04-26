import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/core/services/util.service';
import { AbmLocalidadesDashboardComponent } from './components/abm-localidades-dashboard/abm-localidades-dashboard.component'; 
import { EditAbmLocalidadesDialogComponent } from './components/abm-localidades-dialog/edit-abm-localidades-dialog.component'; 
import { LocalidadesService } from 'src/app/core/services/abm-localidades.service';
import { AbmLocalidades } from 'src/app/core/models/abm-localidades';

@Component({
  selector: 'app-abm-localidades',
  templateUrl: './abm-localidades.component.html',
  styleUrls: ['./abm-localidades.component.scss']
})
export class AbmLocalidadesComponent {

  @ViewChild(AbmLocalidadesDashboardComponent) dashboard: AbmLocalidadesDashboardComponent;

  constructor(private LocalidadesService: LocalidadesService,
              private utils: UtilService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaLocalidad(AbmLocalidades?:AbmLocalidades): void {
    const modalNuevoAbmLocalidades = this.dialog.open(EditAbmLocalidadesDialogComponent, {
      data: {
        title: `Nueva Localidades`,
        edit: true,
        id_tabla: 9,
        codigo_postal: AbmLocalidades?.codigo_postal,
        sub_codigo_postal: AbmLocalidades?.sub_codigo_postal,
        descripcion:AbmLocalidades?.descripcion,
        letra_provincia:AbmLocalidades?.letra_provincia,
        flete_transporte: AbmLocalidades?.flete_transporte,
        posicion_referente: AbmLocalidades?.posicion_referente,
        visitado_auditor: AbmLocalidades?.visitado_auditor,
        zona_promocion: AbmLocalidades?.zona_promocion,
        codigo_departamento: AbmLocalidades?.codigo_departamento,
        zona_envio: AbmLocalidades?.zona_envio,
        ingreso_ticket: AbmLocalidades?.ingreso_ticket,
        zona_atencion: AbmLocalidades?.zona_atencion,
        cant_habitantes: AbmLocalidades?.cant_habitantes,
      }
    });

    modalNuevoAbmLocalidades.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.utils.openLoading();
          this.LocalidadesService.addLocalidad(res).subscribe({
            next: (res: any) => {
              this.utils.notification("El Tipo de Localidades se ha creado exitosamente", 'success')
            },
            error: (err:any) => {
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error') 
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
              this.nuevaLocalidad(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch('');
              }, 300);
            }
          });
        }
      }
    })
  }
}