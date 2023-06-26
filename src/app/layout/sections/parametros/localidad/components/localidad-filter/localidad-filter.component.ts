import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { DepartamentoService } from 'src/app/core/services/departamento.service';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';
import { IDepartamento } from 'src/app/core/models/departamento.interface';

@Component({
  selector: 'app-localidad-filter',
  templateUrl: './localidad-filter.component.html',
  styleUrls: ['./localidad-filter.component.scss'],
})
export class LocalidadFilterComponent {
  @Input() public provincias: IProvincia[];

  @Output() public search: EventEmitter<string> = new EventEmitter<string>();
  @Output() public loadDepartamentos: EventEmitter<IDepartamento[]> =
    new EventEmitter<IDepartamento[]>();

  public departamentos: IDepartamento[];

  @ViewChild('provincia') public provincia: any;
  @ViewChild('departamento') public departamento: any;

  constructor(
    private departamentoService: DepartamentoService,
    private utils: UtilService
  ) {}

  public performSearch(
    localidad: HTMLInputElement,
    codigo: HTMLInputElement
  ): void {
    codigo.value
      ? this.search.emit(
          JSON.stringify({
            par_modo: 'R',
            letra_provincia: this.provincia.value,
            codigo_postal: codigo.value,
          })
        )
      : this.search.emit(
          JSON.stringify({
            par_modo: 'O',
            letra_provincia: this.provincia.value,
            codigo_departamento: this.departamento.value,
            descripcion: localidad.value,
          })
        );
  }

  public clear(localidad: HTMLInputElement, codigo: HTMLInputElement): void {
    this.provincia.value = '';
    this.departamento.value = '';
    if (localidad) localidad.value = '';
    if (codigo) codigo.value = '';
  }

  public getDepartamentos(value: string): void {
    this.utils.openLoading();
    this.departamentoService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          letra_provincia: value,
          descripcion: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          this.departamentos = Array.isArray(res.dataset)
            ? (res.dataset as IDepartamento[])
            : [res.dataset as IDepartamento];
        },
        error: (err: any) => {
          this.utils.closeLoading();
          err.status == 0
            ? this.utils.notification('Error de conexión. ', 'error')
            : err.status == 404
            ? (this.departamentos = [])
            : this.utils.notification(
                `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
                'error'
              );
        },
        complete: () => {
          this.utils.closeLoading();
          this.loadDepartamentos.emit(this.departamentos);
        },
      });
  }

  public validateNumberInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight'];
    const allowedDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const isCtrlPressed = event.ctrlKey || event.metaKey;

    if (
      !(
        allowedDigits.includes(event.key) ||
        allowedKeys.includes(event.key) ||
        (isCtrlPressed &&
          (event.key === 'c' ||
            event.key === 'C' ||
            event.key === 'v' ||
            event.key === 'V' ||
            event.key === 'x' ||
            event.key === 'X' ||
            event.key === 'y' ||
            event.key === 'Y' ||
            event.key === 'z' ||
            event.key === 'Z'))
      )
    ) {
      event.preventDefault();
    }
  }

  public handlePaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData('text/plain');
      if (!/^\d+$/.test(pastedText)) {
        event.preventDefault();
      }
    }
  }
}
