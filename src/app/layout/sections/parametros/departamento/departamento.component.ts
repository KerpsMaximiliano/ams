import { Component, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { DepartamentoService } from 'src/app/core/services/departamento.service';
import { ProvinciaService } from 'src/app/core/services/provincia.service';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';
import { IDepartamento } from 'src/app/core/models/departamento.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { AddEditDepartamentoDialogComponent } from './components/add-edit-departamento-dialog/add-edit-departamento-dialog.component';
import { DepartamentoDashboardComponent } from './components/departamento-dashboard/departamento-dashboard.component';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.scss'],
})
export class DepartamentoComponent {
  @ViewChild(DepartamentoDashboardComponent)
  dashboard: DepartamentoDashboardComponent;
  provincias: IProvincia[] = [];
  request: boolean = false;

  constructor(
    private utils: UtilService,
    private dialog: MatDialog,
    private departamentoService: DepartamentoService,
    private provinciaService: ProvinciaService
  ) {
    this.utils.openLoading();
    this.provinciaService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          nombre_provincia: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          res.dataset.length
            ? (this.provincias = res.dataset as IProvincia[])
            : (this.provincias = [res.dataset]);
        },
        error: () => {
          this.utils.closeLoading();
          this.utils.notification(
            `No se han podido cargar las provincias. `,
            'error'
          );
        },
        complete: () => {
          this.utils.closeLoading();
          this.request = true;
        },
      });
  }

  ngOnInit(): void {}

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevoDepartamento(departamento?: IDepartamento): void {
    const modalNuevoDepartamento = this.dialog.open(
      AddEditDepartamentoDialogComponent,
      {
        data: {
          title: `CREAR DEPARTAMENTO`,
          edit: true,
          par_modo: 'C',
          provincias: this.provincias,
          codigo_departamento: departamento?.codigo_departamento,
          descripcion: departamento?.descripcion,
          descripcion_reducida: departamento?.descripcion_reducida,
        },
      }
    );

    modalNuevoDepartamento.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utils.openLoading();
          this.departamentoService.CRUD(res).subscribe({
            next: (res: any) => {
              this.utils.notification(
                'El departamento se ha creado exitosamente. ',
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
              this.nuevoDepartamento(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch(
                  JSON.stringify({
                    par_modo: 'R',
                    letra_provincia: res.letra_provincia,
                    codigo_departamento: res.codigo_departamento,
                  })
                );
              }, 300);
            },
          });
        }
      },
    });
  }
}
