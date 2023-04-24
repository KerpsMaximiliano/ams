import { Component, ViewChild } from '@angular/core';

// * SERVICES
import { UtilService } from 'src/app/core/services/util.service';
import { PosicionesService } from 'src/app/core/services/posiciones.service';

// * INTERFACES
import { TableColumn } from 'src/app/core/models/table';

// * MATERIAL
import { MatDialog } from '@angular/material/dialog';

// * COMPONENTS
import { Posiciones } from 'src/app/core/models/posicion.interface';
import { AddEditAbmPosicionesComponent } from './add-edit-abm-posiciones/add-edit-abm-posiciones.component';
import { TableComponent } from '../../components/table/table.component';

@Component({
  selector: 'app-abm-posiciones',
  templateUrl: './abm-posiciones.component.html',
  styleUrls: ['./abm-posiciones.component.scss']
})
export class AbmPosicionesComponent {
  // * TABLE
  tableColumns: TableColumn[] = [];
  dataSource: any = [];
  @ViewChild(TableComponent) table: TableComponent;

  constructor(private posicionesService: PosicionesService,
    private utils: UtilService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public handleSearch(inputValue: any): void {
  }

  public nuevaPosicion(posiciones?: Posiciones): void {
    const modalNuevaPosicion = this.dialog.open(AddEditAbmPosicionesComponent, {
      data: {
        title: `Nueva Posicion`,
        id: posiciones?.id,
        codigo: posiciones?.codigo,
        descripcion: posiciones?.descripcion,
      }
    });

    modalNuevaPosicion.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.posicionesService.addPosiciones(res).subscribe({
            next: (res: any) => {
              this.utils.notification("La Posicion se ha creado exitosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error')
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
              this.nuevaPosicion(res);
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
