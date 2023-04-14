import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/core/services/util.service';
import { ProvinciaDashboardComponent } from './components/tipo-provincia-dashboard/provincia-dashboard.component'; 
import { AddEditProvinciaDialogComponent } from './components/edit-provincia-dialog/add-edit-provincia-dialog.component'; 
import { ProvinciaService } from 'src/app/core/services/provincia.service';
import { Provincia } from 'src/app/core/models/provincia';

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  styleUrls: ['./provincia.component.scss']
})
export class ProvinciaComponent {

  @ViewChild(ProvinciaDashboardComponent) dashboard: ProvinciaDashboardComponent;

  constructor(private provinciaService: ProvinciaService,
              private utils: UtilService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaProvincia(tipoProvincia?:Provincia): void {
    const modalNuevaProvincia = this.dialog.open(AddEditProvinciaDialogComponent, {
      data: {
        title: `Nuevo Tipo de Provincia`,
        edit: true,
        id_tabla: 9,
        codigo: tipoProvincia?.codigo,
        nombre_provincia: tipoProvincia?.nombre_provincia,
        codifica_altura: tipoProvincia?.codifica_altura,
        codigo_provincia: tipoProvincia?.codigo_provincia,
        flete_transportista: tipoProvincia?.flete_transportista,
        par_modo: 'I'
      }
    });

    modalNuevaProvincia.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.utils.openLoading();
          this.provinciaService.addProvincia(res).subscribe({
            next: () => {
              this.utils.notification("El Tipo de Provincia se ha creado exitosamente", 'success')
            },
            error: (err:any) => {
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error') 
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
              this.nuevaProvincia(res);
            },
            complete: () => {
              this.utils.closeLoading();
              setTimeout(() => {
                this.handleSearch(res.nombre_provincia);
              }, 300);
            }
          });
        }
      }
    })
  }
}