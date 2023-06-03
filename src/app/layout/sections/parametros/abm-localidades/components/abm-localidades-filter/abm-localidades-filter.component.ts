import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { LocalidadService } from 'src/app/core/services/localidad.service';
import { UtilService } from 'src/app/core/services/util.service';
import {
  isAlphanumeric,
  isAlphanumericWithSpaces,
  isNumeric,
} from 'src/app/core/validators/character.validator';

@Component({
  selector: 'app-abm-localidades-filter',
  templateUrl: './abm-localidades-filter.component.html',
  styleUrls: ['./abm-localidades-filter.component.scss'],
})
export class AbmLocalidadesFilterComponent {
  paramDepto: [] | any;
  paramProv: [] | any;
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  searching = new FormGroup({
    codigo_postal: new FormControl(''),
    letra_provincia: new FormControl(''),
    codigo_departamento: new FormControl(''),
    descripcion: new FormControl(''),
  });
  myControlProv = new UntypedFormControl('');
  provinciaFiltrados: Observable<any[]>;
  myControldepto = new UntypedFormControl('');
  deptoFiltrados: Observable<any[]>;
  constructor(
    private LocalidadesService: LocalidadService,
    private utils: UtilService
  ) {}

  ngOnInit() {
    let bodyprov = {
      par_modo: 'C',
      nombre_provincia: '',
    };
    this.LocalidadesService.getProvincia(bodyprov).subscribe({
      next: (res) => {
        this.paramProv = res.dataset;
      },
      error: (err) => {
        console.log(err);
        err.status == 0
          ? this.utils.notification('Error de conexion', 'error')
          : this.utils.notification(
              `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
              'error'
            );
      },
    });
    this.provinciaFiltrados = this.myControlProv.valueChanges.pipe(
      startWith(''),
      map((valueProv) => {
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

  public search() {
    this.searchEvent.emit(this.searching.value);
  }

  buscar(letra_provincia: string) {
    this.searching.get('letra_provincia')?.setValue(letra_provincia),
      console.log(letra_provincia);
    let bodydep = {
      par_modo: 'C',
      descripcion: '',
      letra_provincia: letra_provincia,
    };
    this.utils.openLoading();
    this.LocalidadesService.getDepart(bodydep).subscribe({
      next: (res) => {
        this.paramDepto = res.dataset;
      },
      error: (err) => {
        console.log(err);
        err.status == 0
          ? this.utils.notification('Error de conexion', 'error')
          : this.utils.notification(
              `Status Code ${err.error.returnset.Codigo}: ${err.error.returnset.Mensaje}`,
              'error'
            );
      },
      complete: () => {
        this.utils.closeLoading();
        setTimeout(() => {}, 300);
      },
    });
    this.deptoFiltrados = this.myControldepto.valueChanges.pipe(
      startWith(''),
      map((valueDep) => {
        const nameDepto =
          typeof valueDep === 'string' ? valueDep : valueDep?.descripcion;
        return nameDepto
          ? this._filterDep(nameDepto as string)
          : this.paramDepto?.descripcion;
      })
    );
  }

  displayFnDep(depto: any): string {
    return depto && depto.descripcion ? depto.descripcion : '';
  }

  private _filterDep(nameDepto: string): any[] {
    const filterValueDepto = nameDepto.toLowerCase();
    return this.paramDepto.filter((filtroDep: any) =>
      filtroDep.descripcion.toLowerCase().includes(filterValueDepto)
    );
  }

  dato(codigo: string) {
    this.searching.get('codigo_departamento')?.setValue(codigo);
  }

  public searchid(e: any) {
    e.preventDefault();
    this.searchEvent.emit(this.searching.value);
  }

  public clearInputs() {
    this.myControlProv?.setValue(''),
      this.myControldepto?.setValue(''),
      this.searching.get('codigo_postal')?.setValue(''),
      this.searching.get('letra_provincia')?.setValue(''),
      this.searching.get('codigo_departamento')?.setValue(''),
      this.searching.get('descripcion')?.setValue('');
  }

  public searchKeyUp(e: any): void {
    e.preventDefault();
    this.searchEvent.emit(this.searching.value);
  }
}
