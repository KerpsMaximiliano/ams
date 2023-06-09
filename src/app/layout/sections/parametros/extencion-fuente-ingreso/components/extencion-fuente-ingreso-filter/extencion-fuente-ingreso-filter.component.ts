import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-extencion-fuente-ingreso-filter',
  templateUrl: './extencion-fuente-ingreso-filter.component.html',
  styleUrls: ['./extencion-fuente-ingreso-filter.component.scss']
})
export class ExtencionFuenteIngresoFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  searchForm = new FormGroup({
    fuente_ingreso: new FormControl(''),
    producto: new FormControl(''),
    vigencia: new FormControl('')
  });

  constructor(
  ) {}

  ngOnInit() {
    // this.cargaDatos('E', 'listEmpresas');
  }

  // cargaDatos(dato: string, consulta: string) {
  //   let body = {
  //     par_modo: dato,
  //   };
  //   this.fuenteIngresoService.CRUD(JSON.stringify(body)).subscribe({
  //     next: (res: any) => {
  //       if (consulta == 'listEmpresas') {
  //         this.listEmpresas = res.dataset;
  //       } else if (consulta == 'listIngreso') {
  //         this.listIngrasos = res.dataset;
  //       }
  //     },
  //     error: (err: any) => {
  //       err.status == 0
  //         ? this.utils.notification('Error de conexión. ', 'error')
  //         : this.utils.notification(
  //             `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}. `,
  //             'error'
  //           );
  //     },
  //   });
  // }

  public search() {
    this.searchEvent.emit(this.searchForm.value);
  }

  public clearInputs() {
    this.searchForm.get('producto')?.setValue('');
    this.searchForm.get('vigencia')?.setValue('');
  }

  public searchKeyUp(e: any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searchForm.value);
  }
}
