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
  private entidades: IEntidad[];
  private entity: IEntidad;
  private ent_sancor: number;
  private canal: number;
  private backUpEntity: any;

  @ViewChild('inputEntidad') public inputEntidad: any;

  @Output() public handleSearch: EventEmitter<any> = new EventEmitter<any>();
  @Output() public handleStatus: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() public handleEntity: EventEmitter<IEntidad> =
    new EventEmitter<IEntidad>();

  constructor(
    private entidadService: EntidadService,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {}

  public performSearch(inputElement: string): void {
    this.handleEntity.emit(this.entity);
    this.handleSearch.emit(
      JSON.stringify({
        par_modo: 'O',
        razon_social: inputElement,
        ent_sancor: this.ent_sancor,
        canal: this.canal,
      })
    );
  }

  public clear(inputElement: HTMLInputElement): void {
    inputElement.value = '';
  }

  public clearEntity(inputElement: HTMLInputElement): void {
    inputElement.value = '';
    this.handleEntity.emit();
    this.handleStatus.emit(false);
  }

  public searchEntity(): void {
    if (this.entidadService.getEntidad()) {
      this.entidades = this.entidadService.getEntidad();
      this.setEntidad(this.entidades);
    } else {
      this.getEntidad();
    }
  }

  private getEntidad(): void {
    this.utilService.openLoading();
    this.entidadService
      .CRUD(
        JSON.stringify({
          par_modo: 'LE',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.entidades = Array.isArray(res.dataset)
            ? (res.dataset as IEntidad[])
            : [res.dataset as IEntidad];
          this.setEntidad(this.entidades);
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
          this.entidadService.setEntidad(this.entidades);
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
          if (this.entity) {
            if (this.entity !== res) {
              this.handleStatus.emit(false);
            } else {
              this.handleStatus.emit(true);
            }
          }

          this.entity = res;
          this.handleEntity.emit(res);
          this.ent_sancor = res?.nro_asesor ? res?.nro_asesor : 0;
          this.canal = res?.canal ? res?.canal : 0;
          this.inputEntidad.nativeElement.value = `${res?.nro_asesor}${res?.canal}`;
        }
      },
    });
  }
}
