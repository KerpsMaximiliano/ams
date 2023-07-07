import { Component, EventEmitter, Output } from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { FuenteIngresoService } from 'src/app/core/services/fuente-ingreso.service';

// * Forms
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fuente-ingreso-filter',
  templateUrl: './fuente-ingreso-filter.component.html',
  styleUrls: ['./fuente-ingreso-filter.component.scss'],
})
export class FuenteIngresoFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  searchForm = new FormGroup({
    par_modo: new FormControl('O'),
    descripcion: new FormControl(''),
    empresa_asociada: new FormControl(''),
  });
  listEmpresas: any[];

  constructor(
    private utils: UtilService,
    public fuenteIngresoService: FuenteIngresoService
  ) {
    this.cargaDatos('E', 'listEmpresas');
  }

  ngOnInit() {}

  private cargaDatos(dato: string, consulta: string): void {
    let body = {
      par_modo: dato,
    };
    this.fuenteIngresoService.CRUD(JSON.stringify(body)).subscribe({
      next: (res: any) => {
        if (consulta == 'listEmpresas') {
          this.listEmpresas = res.dataset;
        }
      },
      error: (err: any) => {
        err.status == 0
          ? this.utils.notification('Error de conexión. ', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
              'error'
            );
      },
    });
  }

  public limpiar(): boolean {
    return this.searchForm.get('descripcion')?.value != '' ||
      this.searchForm.get('empresa_asociada')?.value != ''
      ? false
      : true;
  }

  public search() {
    this.searchEvent.emit(this.searchForm.value);
  }

  public clearInputs() {
    this.searchForm.get('descripcion')?.setValue('');
    this.searchForm.get('empresa_asociada')?.setValue('');
  }

  public searchKeyUp(e: any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searchForm.value);
  }
}
