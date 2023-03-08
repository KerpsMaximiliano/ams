import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/core/services/util.service';
import { TipoNacionalidadDashboardComponent } from './components/tipo-nacionalidad-dashboard/tipo-nacionalidad-dashboard.component'; 
import { EditTipoNacionalidadDialogComponent } from './components/edit-tipo-nacionalidad-dialog/edit-tipo-nacionalidad-dialog.component'; 
import { NacionalidadService } from 'src/app/core/services/nacionalidad.service';
import { TipoNacionalidad } from 'src/app/core/models/tipo-nacionalidad';

@Component({
  selector: 'app-tipo-nacionalidad',
  templateUrl: './tipo-nacionalidad.component.html',
  styleUrls: ['./tipo-nacionalidad.component.scss']
})
export class TipoNacionalidadComponent {

  @ViewChild(TipoNacionalidadDashboardComponent) dashboard: TipoNacionalidadDashboardComponent;

  constructor(private nacionalidadService: NacionalidadService,
              private utils: UtilService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaNacionalidad(tipoNacionalidad?:TipoNacionalidad): void {
    const modalNuevoTipoNacionalidad = this.dialog.open(EditTipoNacionalidadDialogComponent, {
      data: {
        title: `Nuevo Tipo de Nacionalidad`,
        edit: true,
        id_tabla: 3,
        codigo_nacionalidad_nuevo: tipoNacionalidad?.codigo_nacionalidad_nuevo,
        descripcion: tipoNacionalidad?.descripcion,
        codigo_nacionalidad: tipoNacionalidad?.codigo_nacionalidad,
      }
    });

    modalNuevoTipoNacionalidad.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.utils.openLoading();
          this.nacionalidadService.addNacionalidad(res).subscribe({
            next: (res: any) => {
              this.utils.notification("El Tipo de Nacionalidad se ha creado exitosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error') 
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
              this.nuevaNacionalidad(res);
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