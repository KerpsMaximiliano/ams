import { Component, EventEmitter, Output } from '@angular/core';
import { map, Observable, startWith } from 'rxjs';

// * Services
import { PosicionService } from 'src/app/core/services/posicion.service';

// * Forms
import { FormControl, FormGroup, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-posicion-filter',
  templateUrl: './posicion-filter.component.html',
  styleUrls: ['./posicion-filter.component.scss'],
})
export class PosicionFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();

  searching = new FormGroup({
    letra_provincia: new FormControl(),
    descripcion: new FormControl(''),
  });
  paramProv: any;
  provinciaFiltrados: Observable<any[]>;
  myControlProv = new UntypedFormControl('');

  utils: any;

  constructor(private posicionesService: PosicionService) {}

  ngOnInit(): void {
    let bodyprov = {
      par_modo: 'C',
      nombre_provincia: '',
    };
    this.posicionesService.getProv(bodyprov).subscribe({
      next: (res) => {
        this.paramProv = res.dataset;
      },
      error: (err) => {
        err.status == 0
          ? this.utils.notification('Error de conexión. ', 'error')
          : this.utils.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
      },
    });
    this.provinciaFiltrados = this.myControlProv.valueChanges.pipe(
      startWith(''),
      map((valueProv: { nombre_provincia: any }) => {
        const nameProv =
          typeof valueProv === 'string'
            ? valueProv
            : valueProv?.nombre_provincia;
        return nameProv
          ? this._filterProv(nameProv as string)
          : this.paramProv?.nombre_provincia;
      })
    );
  }

  displayFnProv(prov: any): string {
    return prov && prov.nombre_provincia ? prov.nombre_provincia : '';
  }

  private _filterProv(nameProv: string): any[] {
    const filterValueProv = nameProv.toLowerCase();
    return this.paramProv.filter((prov: any) =>
      prov.nombre_provincia.toLowerCase().includes(filterValueProv)
    );
  }

  dato(codigo: string) {
    this.searching.value.letra_provincia = codigo;
  }

  public search(): void {
    this.searchEvent.emit(this.searching.value);
  }

  public clearInputs() {
    this.searching.value.letra_provincia = '';
    this.searching.value.descripcion = '';
    this.search();
  }
}
