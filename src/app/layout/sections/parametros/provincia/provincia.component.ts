import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { ProvinciaService } from 'src/app/core/services/provincia.service';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Component
import { AddEditProvinciaDialogComponent } from './components/add-edit-provincia-dialog/add-edit-provincia-dialog.component';
import { ProvinciaDashboardComponent } from './components/provincia-dashboard/provincia-dashboard.component';

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  styleUrls: ['./provincia.component.scss'],
})
export class ProvinciaComponent {
  @ViewChild(ProvinciaDashboardComponent)
  dashboard: ProvinciaDashboardComponent;

  constructor(
    private provinciaService: ProvinciaService,
    private utils: UtilService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaProvincia(provincia?: IProvincia): void {
    const modalNuevaProvincia = this.dialog.open(
      AddEditProvinciaDialogComponent,
      {
        data: {
          title: `CREAR PROVINCIA`,
          edit: true,
          par_modo: 'I',
          codigo: provincia?.codigo,
          nombre_provincia: provincia?.nombre_provincia,
          codifica_altura: provincia?.codifica_altura,
          codigo_provincia: provincia?.codigo_provincia,
          flete_transportista: provincia?.flete_transportista,
        },
      }
    );

    modalNuevaProvincia.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.provinciaService.CRUD(res).subscribe({
            next: () => {
              this.utils.notification(
                'La Provincia se ha creado exitosamente. ',
                'success'
              );
            },
            error: (err: any) => {
              this.utils.closeLoading();
              err.status == 0
                ? this.utils.notification('Error de conexión. ', 'error')
                : this.utils.notification(
                    `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                    'error'
                  );
              this.nuevaProvincia(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch(res.nombre_provincia.trim());
              }, 300);
            },
          });
        }
      },
    });
  }
}
