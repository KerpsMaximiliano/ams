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
        title: `Nuevo Tipo de Localidades`,
        edit: true,
        id_tabla: 9,
        codigo: AbmLocalidades?.codigo,
        subcodigo: AbmLocalidades?.subcodigo,
        nombre_localidad:AbmLocalidades?.nombre_localidad,
        letra_provincia:AbmLocalidades?.letra_provincia,
        flete_transportista: AbmLocalidades?.flete_transportista,
        referente: AbmLocalidades?.referente,
        medico: AbmLocalidades?.medico,
        zona_promocion: AbmLocalidades?.zona_promocion,
        cod_departamento: AbmLocalidades?.cod_departamento,
        zona_envio: AbmLocalidades?.zona_envio,
        ticket: AbmLocalidades?.ticket,
        zona_atencion: AbmLocalidades?.zona_atencion,
        habitantes: AbmLocalidades?.habitantes,
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