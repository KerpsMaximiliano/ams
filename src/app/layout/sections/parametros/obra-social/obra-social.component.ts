import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/core/services/util.service';
import { AddEditObraSocialDialogComponent } from './components/add-edit-obra-social-dialog/add-edit-obra-social-dialog.component';
import { ObraSocialDashboardComponent } from './components/obra-social-dashboard/obra-social-dashboard.component';
import { ObraSocial } from 'src/app/core/models/obra-social.interface';
import { ObraSocialService } from 'src/app/core/services/obra-social.service';

@Component({
  selector: 'app-obra-social',
  templateUrl: './obra-social.component.html',
  styleUrls: ['./obra-social.component.scss']
})
export class ObraSocialComponent {

  @ViewChild(ObraSocialDashboardComponent) dashboard: ObraSocialDashboardComponent;

  constructor(private obraSocialService: ObraSocialService,
              private utils: UtilService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  public handleSearch(inputValue: any): void {
    this.dashboard.filter(inputValue);
  }

  public nuevoObraSocial(ObraSocial?: ObraSocial): void {
    const modalNuevoObraSocial = this.dialog.open(AddEditObraSocialDialogComponent, {
      data: {
        id: 99,
        title: `Crear Obra Social`,
        edit: true,
        tipo: ObraSocial?.descripcion,
        formulario: ObraSocial?.formulario,
        tipo_documento: ObraSocial?.tipo_de_documento,
      }
    });

    modalNuevoObraSocial.afterClosed().subscribe({
      next:(res) => {
        if (res) {
          let body = res;
          delete body['id'];
          this.utils.openLoading();
          this.obraSocialService.addDocument(body).subscribe({
            next: () => {
              this.utils.notification("El Documento se ha creado exitosamente", 'success')
            },
            error: (err) => {
              this.utils.closeLoading();
              (err.status == 0)
                ? this.utils.notification('Error de conexion', 'error') 
                : this.utils.notification(`Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`, 'error')
                this.nuevoObraSocial(res)
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