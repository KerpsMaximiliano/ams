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
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';
import { Router } from '@angular/router';
import { IFuenteIngreso } from 'src/app/core/models/fuente-ingreso.interface';

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
  fuente_ingreso: IExtencionFuenteIngreso;
  fuenteIngreso: IFuenteIngreso;

  constructor(
    private extencionFuenteIngreso: ExtencionFuenteIngresoService,
    private FuenteIngresoService: FuenteIngresoService,
    private utilService: UtilService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.fuenteIngreso = this.FuenteIngresoService.get();
  }

  ngOnInit(): void {
    if (!this.fuenteIngreso) {
        this.router.navigate(['parametros/fuentes-ingreso']);
      }
  }

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public back(): void {
    this.utilService.openLoading();
    this.FuenteIngresoService.setBack(true);
    this.router.navigate(['parametros/fuentes-ingreso']);
    return;
  }

  public validarBoton(): boolean {
    if (this.filter)
      return this.filter.searchForm.get('producto')?.value != 0 &&
        this.filter.searchForm.get('producto_des')?.value != '' &&
        this.filter.searchForm.get('fecha_de_vigencia')?.value != 0
        ? false
        : true;
    return false;
  }

  public nuevaExtencionFuenteIngreso(): void {
    const modalNuevaExtencionFuenteIngreso = this.dialog.open(
      AddEditExtencionFuenteIngresoComponent,
      {
        data: {
          title: `CREAR COEFICIENTE DE FUENTE DE INGRESO`,
          edit: true,
          par_modo: 'C',
          codigo_fuente_ingreso: this.filter.searchForm.get(
            'codigo_fuente_ingreso'
          )?.value,
          fuente_ingreso: this.filter.searchForm.get('fuente_ingreso')?.value,
          producto: this.filter.searchForm.get('producto')?.value,
          producto_des: this.filter.searchForm.get('producto_des')?.value,
          fecha_de_vigencia:
            this.filter.searchForm.get('fecha_de_vigencia')?.value,
        },
      }
    );

    modalNuevaExtencionFuenteIngreso.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.utilService.openLoading();
          this.extencionFuenteIngreso
            .CRUD(JSON.stringify(res.datos))
            .subscribe({
              next: () => {
                this.dashboard.getExtencionFuenteIngraso();
                if (res.reload) {
                  this.nuevaExtencionFuenteIngreso();
                }
                this.utilService.notification(
                  'Los coeficientes de fuente de ingreso se ha creado exitosamente. ',
                  'success'
                );
              },
              error: (err) => {
                this.utilService.closeLoading();
                this.nuevaExtencionFuenteIngreso();
                err.status == 0
                  ? this.utilService.notification(
                      'Error de conexión. ',
                      'error'
                    )
                  : this.utilService.notification(
                      `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                      'error'
                    );
              },
              complete: () => {
                this.utilService.closeLoading();
              },
            });
        }
      },
    });
  }
}
