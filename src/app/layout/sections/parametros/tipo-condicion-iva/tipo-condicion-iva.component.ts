import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditCondicionIvaDialogComponent } from './components/add-edit-condicion-iva-dialog/add-edit-condicion-iva-dialog.component';
import { CondicionIvaDashboardComponent } from './components/tipo-condicion-iva-dashboard/tipo-condicion-iva-dashboard.component';
import { CondicionIva } from 'src/app/core/models/tipo-condicion-iva.interface';
import { CondicionIvaService } from 'src/app/core/services/tipo-condicion-iva.service';

@Component({
  selector: 'app-condicion-iva-documento',
  templateUrl: './tipo-condicion-iva.component.html',
  styleUrls: ['./tipo-condicion-iva.component.scss']
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
          id: 99,
          title: `Crear condición de IVA`,
          edit: true,
          tipo: condicionIva?.descripcion,
          abreviatura: condicionIva?.codigo,
          cuit: condicionIva?.formulario,
          tipo_documento: condicionIva?.tipo_de_documento,
        }
      });
  
      modalNuevaCondicionIva.afterClosed().subscribe({
        next:(res) => {
          if (res) {
            let body = res;
            delete body['id'];
            this.utils.openLoading();
            this.condicionIvaService.addDocument(body).subscribe({
              next: () => {
                this.utils.notification("El Documento se ha creado exitosamente", 'success')
              },
              error: (err) => {
                this.utils.closeLoading();
                (err.status == 0)
                  ? this.utils.notification('Error de conexion', 'error') 
                  : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
                  this.nuevaCondicionIVA(res)
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