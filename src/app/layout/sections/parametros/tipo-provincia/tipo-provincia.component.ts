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
        Cod_provincia: tipoProvincia?.Cod_provincia,
        descripcion: tipoProvincia?.descripcion,
        Codifica_Alturas: tipoProvincia?.Codifica_Alturas,
        Codigo_provincia: tipoProvincia?.Codigo_provincia,
        Flete_Transportistas: tipoProvincia?.Flete_Transportistas
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