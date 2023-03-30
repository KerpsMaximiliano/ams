import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/core/services/util.service';
import { TipoProvinciaDashboardComponent } from './components/tipo-provincia-dashboard/tipo-provincia-dashboard.component'; 
import { EditTipoProvinciaDialogComponent } from './components/edit-tipo-provincia-dialog/edit-tipo-provincia-dialog.component'; 
import { ProvinciaService } from 'src/app/core/services/tipo-provincia.service';
import { TipoProvincia } from 'src/app/core/models/tipo-provincia';

@Component({
  selector: 'app-tipo-provincia',
  templateUrl: './tipo-provincia.component.html',
  styleUrls: ['./tipo-provincia.component.scss']
})
export class TipoProvinciaComponent {

  @ViewChild(TipoProvinciaDashboardComponent) dashboard: TipoProvinciaDashboardComponent;

  constructor(private ProvinciaService: ProvinciaService,
              private utils: UtilService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevaProvincia(tipoProvincia?:TipoProvincia): void {
    const modalNuevoTipoProvincia = this.dialog.open(EditTipoProvinciaDialogComponent, {
      data: {
        title: `Nuevo Tipo de Provincia`,
        edit: true,
        id_tabla: 9,
        codigo: tipoProvincia?.codigo,
        nombre_provincia: tipoProvincia?.nombre_provincia,
        codifica_altura: tipoProvincia?.codifica_altura,
        codigo_provincia: tipoProvincia?.codigo_provincia,
        flete_transportista: tipoProvincia?.flete_transportista,
      }
    });

    modalNuevoTipoProvincia.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.utils.openLoading();
          this.ProvinciaService.addProvincia(res).subscribe({
            next: (res: any) => {
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
                this.handleSearch('');
              }, 300);
            }
          });
        }
      }
    })
  }
}