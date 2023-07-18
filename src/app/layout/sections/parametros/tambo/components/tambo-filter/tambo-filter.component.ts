import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { EntidadService } from 'src/app/core/services/entidad.service';

// * Interfaces
import { IEntidad } from 'src/app/core/models/entidad.interface';

// * Material
import { MatDialog } from '@angular/material/dialog';

// * Components
import { TamboSetEntidadDialogComponent } from '../tambo-set-posicion-dialog/tambo-set-entidad-dialog.component';

@Component({
  selector: 'app-tambo-filter',
  templateUrl: './tambo-filter.component.html',
  styleUrls: ['./tambo-filter.component.scss'],
})
export class TamboFilterComponent {
  private ent_sancor: number;
  private canal: number;

  @ViewChild('entidad') public entidad: any;

  @Output() public search: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private entidadService: EntidadService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  public performSearch(inputElement: string): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        razon_social: inputElement ? inputElement : '',
        ent_sancor: this.ent_sancor ? this.ent_sancor : 0,
        canal: this.canal ? this.canal : 0,
      })
    );
  }

  public clear(inputElement: HTMLInputElement): void {
    inputElement.value = '';
  }

  public getEntidad(): void {
    this.utilService.openLoading();
    this.entidadService
      .CRUD(
        JSON.stringify({
          par_modo: 'LE',
        })
      )
      .subscribe({
        next: (res: any) => {
          let data: IEntidad[] = Array.isArray(res.dataset)
            ? (res.dataset as IEntidad[])
            : [res.dataset as IEntidad];
          this.setEntidad(data);
        },
        error: (err: any) => {
          this.utilService.closeLoading();
          err.status === 0
            ? this.utilService.notification('Error de conexión.', 'error')
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

  private setEntidad(data: IEntidad[]): void {
    const modal = this.dialog.open(TamboSetEntidadDialogComponent, {
      data: {
        title: 'SELECCIONE UNA ENTIDAD',
        data: data,
      },
    });
    modal.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.ent_sancor = res?.nro_asesor;
          this.canal = res?.canal;
          this.entidad.nativeElement.value = `${res?.nro_asesor}${res?.canal}`;
        }
      },
    });
  }
}
