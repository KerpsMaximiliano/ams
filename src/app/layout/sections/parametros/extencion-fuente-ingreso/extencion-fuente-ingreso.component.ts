import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { ExtencionFuenteIngresoService } from 'src/app/core/services/extencion-fuente-ingreso.service';

// * Interfaces
import { IExtencionFuenteIngreso } from 'src/app/core/models/extencion-fuente-ingreso.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AddEditExtencionFuenteIngresoComponent } from './components/add-edit-extencion-fuente-ingreso/add-edit-extencion-fuente-ingreso.component';
import { ExtencionFuenteIngresoDashboardComponent } from './components/extencion-fuente-ingreso-dashboard/extencion-fuente-ingreso-dashboard.component';
import { ExtencionFuenteIngresoFilterComponent } from './components/extencion-fuente-ingreso-filter/extencion-fuente-ingreso-filter.component';

@Component({
  selector: 'app-extencion-fuente-ingreso',
  templateUrl: './extencion-fuente-ingreso.component.html',
  styleUrls: ['./extencion-fuente-ingreso.component.scss'],
})
export class ExtencionFuenteIngresoComponent {
  @ViewChild(ExtencionFuenteIngresoFilterComponent)
  filter: ExtencionFuenteIngresoFilterComponent;
  @ViewChild(ExtencionFuenteIngresoDashboardComponent)
  dashboard: ExtencionFuenteIngresoDashboardComponent;

  constructor(
    private extencionFuenteIngreso: ExtencionFuenteIngresoService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaExtencionFuenteIngreso(
    fuenteingreso?: IExtencionFuenteIngreso
  ): void {
    const modalNuevaExtencionFuenteIngreso = this.dialog.open(
      AddEditExtencionFuenteIngresoComponent,
      {
        data: {
          title: `CREAR FUENTE DE INGRESO`,
          edit: true,
          par_modo: 'C',
          fuenteIngreso: fuenteingreso?.fuenteingreso,
          producto: fuenteingreso?.producto,
          vigencia: fuenteingreso?.vigencia,
        },
      }
    );

    modalNuevaExtencionFuenteIngreso.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.extencionFuenteIngreso.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La extencion de fuente de ingreso se ha creado exitosamente. ',
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
              this.nuevaExtencionFuenteIngreso(res);
            },
            complete: () => {
              this.utils.closeLoading();
              if (res.reload) {
                this.nuevaExtencionFuenteIngreso();
              }
            },
          });
        }
      },
    });
  }
}
