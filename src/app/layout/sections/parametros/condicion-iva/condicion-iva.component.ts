import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditCondicionIvaDialogComponent } from './components/add-edit-condicion-iva-dialog/add-edit-condicion-iva-dialog.component';
import { CondicionIvaDashboardComponent } from './components/condicion-iva-dashboard/condicion-iva-dashboard.component';
import { CondicionIva } from 'src/app/core/models/condicion-iva.interface';
import { CondicionIvaService } from 'src/app/core/services/condicion-iva.service';

@Component({
  selector: 'app-condicion-iva-documento',
  templateUrl: './condicion-iva.component.html',
  styleUrls: ['./condicion-iva.component.scss']
})
export class CondicionIvaComponent {

  @ViewChild(CondicionIvaDashboardComponent) dashboard: CondicionIvaDashboardComponent;

  constructor(private condicionIvaService: CondicionIvaService,
    private utils: UtilService,
    private dialog: MatDialog) { }

    ngOnInit(): void {
    }
  
    public handleSearch(inputValue: any): void {
      this.dashboard.filter(inputValue);
    }
  
    public nuevaCondicionIVA(condicionIva?: CondicionIva): void {
      const modalNuevaCondicionIva = this.dialog.open(AddEditCondicionIvaDialogComponent, {
        data: {
          title: `CREAR CONDICIÓN DE IVA`,
          par_modo: "I",
          edit: true,
          codigoCondIva: condicionIva?.codigo_de_IVA,
          descripcion: condicionIva?.descripcion,
          abreviatura: condicionIva?.descripcion_reducida,
          formulario: condicionIva?.formulario_AB,
        }
      });
  
      modalNuevaCondicionIva.afterClosed().subscribe({
        next:(res) => {
          if (res) {
            this.utils.openLoading();
            this.condicionIvaService.getCondicionIvaCRUD(res).subscribe({
              next: () => {
                this.utils.notification("La Condicion IVA se ha creado exitosamente", 'success')
              },
              error: (err) => {
                this.utils.closeLoading();
                (err.status == 0)
                  ? this.utils.notification('Error de conexion', 'error') 
                  : this.utils.notification(`Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`, 'error')
                  this.nuevaCondicionIVA(res)
              },
              complete: () => {
                this.utils.closeLoading();
                setTimeout(() => {
                  this.handleSearch(JSON.stringify({
                    par_modo: "C",
                    descripcion: res.descripcion
                  }));
                }, 300);
              }
            });
          }
        }
      })
    }
  }