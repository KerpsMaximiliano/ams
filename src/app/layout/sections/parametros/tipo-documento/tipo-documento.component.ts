import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditTipoDocumentoDialogComponent } from './components/add-edit-tipo-documento-dialog/add-edit-tipo-documento-dialog.component';
import { TipoDocumentoDashboardComponent } from './components/tipo-documento-dashboard/tipo-documento-dashboard.component';
import { TipoDocumento } from 'src/app/core/models/tipo-documento';
import { TipoDocumentoService } from 'src/app/core/services/tipo-documento.service';

@Component({
  selector: 'app-tipo-documento',
  templateUrl: './tipo-documento.component.html',
  styleUrls: ['./tipo-documento.component.scss']
})
export class TipoDocumentoComponent {

  @ViewChild(TipoDocumentoDashboardComponent) dashboard: TipoDocumentoDashboardComponent;

  constructor(private parametrosService: TipoDocumentoService,
              private utils: UtilService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevoTipoDocumento(tipoDocumento?: TipoDocumento): void {
    const modalNuevoTipoDocumento = this.dialog.open(AddEditTipoDocumentoDialogComponent, {
      data: {
        title: `Crear Tipo de Documento`,
        edit: true,
        tipo: tipoDocumento?.descripcion,
        abreviatura: tipoDocumento?.descripcion_reducida,
        cuit: tipoDocumento?.control_cuit,
        tipo_documento: tipoDocumento?.tipo_de_documento,
      }
    });

    modalNuevoTipoDocumento.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          this.utils.openLoading();
          this.parametrosService.addDocument(res).subscribe({
            next: () => {
              this.utils.notification("El Documento se ha creado exitosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error') 
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
                this.nuevoTipoDocumento(res)
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
