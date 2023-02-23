import { UtilService } from './../../../core/services/util.service';
import { EstadosService } from './../../../core/services/estados.service';
import { AddEditEstadoDialogComponent } from './components/add-edit-estado-dialog/add-edit-estado-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import { EstadosDashboardComponent } from './components/components/estados-dashboard/estados-dashboard.component';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.scss']
})
export class EstadosComponent {

  @ViewChild(EstadosDashboardComponent) dashboard: EstadosDashboardComponent;

  constructor(private estadosService: EstadosService,
              private utils: UtilService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevoEstado(): void {
    const modalNuevoEstado = this.dialog.open(AddEditEstadoDialogComponent, {
      data: {
        title: `Nuevo Estado`
      }
    });

    modalNuevoEstado.afterClosed().subscribe({
      next:(res) => {
        if (res && res.length > 0) {
          this.utils.openLoading();
          this.estadosService.addEstado(res).subscribe({
            next: (res: any) => {
              this.utils.notification("El estado se ha creado exitosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              this.utils.notification(`Error al crear estado: ${err.error.message}`, 'error')
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
