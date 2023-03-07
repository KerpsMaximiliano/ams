import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/core/services/util.service';
import { TipoNacionalidadDashboardComponent } from './components/tipo-nacionalidad-dashboard/tipo-nacionalidad-dashboard.component'; 
import { EditTipoNacionalidadDialogComponent } from './components/edit-tipo-nacionalidad-dialog/edit-tipo-nacionalidad-dialog.component'; 
import { EstadosService } from 'src/app/core/services/estados.service';

@Component({
  selector: 'app-tipo-nacionalidad',
  templateUrl: './tipo-nacionalidad.component.html',
  styleUrls: ['./tipo-nacionalidad.component.scss']
})
export class TipoNacionalidadComponent {

  @ViewChild(TipoNacionalidadDashboardComponent) dashboard: TipoNacionalidadDashboardComponent;

  constructor(private estados: EstadosService,
              private utils: UtilService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaNacionalidad(): void {
    const modalNuevoTipoNacionalidad = this.dialog.open(EditTipoNacionalidadDialogComponent, {
      data: {
        title: `Nuevo Tipo de Nacionalidad`,
        edit: true
      }
    });

    modalNuevoTipoNacionalidad.afterClosed().subscribe({
      next:(res) => {
        if (res && res.length > 0) {
          this.utils.openLoading();
          this.estados.addEstado(res).subscribe({
            next: (res: any) => {
              this.utils.notification("El Tipo de Nacionalidad se ha creado exitosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              this.utils.notification(`Error al crear Tipo de Nacionalidad: ${err.error.message}`, 'error')
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