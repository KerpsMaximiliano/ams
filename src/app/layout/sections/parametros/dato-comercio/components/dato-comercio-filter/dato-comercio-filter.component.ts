import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSelect } from '@angular/material/select';

// * Interfaces
import {
  IFiltroDatoComercio,
  ITipoFormaPago,
} from 'src/app/core/models/dato-comercio.interface';
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';
import {
  IFormaPago,
  IFormaPagoResponse,
} from 'src/app/core/models/formas-pago.interface';
import { FormaPagoService } from 'src/app/core/services/forma-pago.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
  selector: 'app-dato-comercio-filter',
  templateUrl: './dato-comercio-filter.component.html',
  styleUrls: ['./dato-comercio-filter.component.scss'],
})
export class DatoComercioFilterComponent implements AfterViewInit {
  @Output() public search: EventEmitter<IFiltroDatoComercio> =
    new EventEmitter<IFiltroDatoComercio>();

  @Input() public empresaFactura?: IEmpresaFactura;
  @Input() public formasPago?: ITipoFormaPago[];
  @Input() public isLoadingFormaPago: boolean;
  @Input() public loadingError: boolean;

  /** Lista de tarjetas filtradas */
  public tarjetas: IFormaPago[] = [];

  public isLoadingTarjeta: boolean = false;

  /**
   * Estado de expansión del formulario. Por defecto está expandido
   * @defaultValue `true`
   */
  @Input() public expanded: boolean = false;

  /* Campos del formulario */
  @ViewChild('formaPago') private formaPago: MatSelect;
  @ViewChild('tarjeta') private tarjeta: MatSelect;

  constructor(
    private formaPagoService: FormaPagoService,
    private utilService: UtilService
  ) {}

  ngAfterViewInit(): void {
    this.formaPago.valueChange.subscribe((value: ITipoFormaPago) =>
      this.getTarjetas(value)
    );
  }

  public performSearch(): void {
    this.search.emit({
      empresaFactura: this.empresaFactura,
      formaPago: this.formaPago?.value,
      tarjeta: this.tarjeta?.value,
    });
  }

  public clear(): void {
    this.formaPago.writeValue(null);
    this.tarjeta.writeValue(null);
    this.tarjetas = [];
  }

  private getTarjetas(formaPago: ITipoFormaPago) {
    this.utilService.openLoading();
    this.loadingError = false;
    this.isLoadingTarjeta = true;
    this.formaPagoService
      .CRUD(
        JSON.stringify({
          par_modo: 'H',
          forma_pago: formaPago.id_forma_pago,
        })
      )
      .subscribe({
        next: (res: IFormaPagoResponse) => {
          this.tarjetas = res.dataset;
          this.isLoadingTarjeta = false;
          this.loadingError ||= false;
        },
        error: (err) => {
          this.utilService.closeLoading();
          if (err.status === 0) {
            this.utilService.notification('Error de conexión.', 'error');
            this.loadingError = true;
          } else if (err.status === 404) {
            this.tarjetas = [];
            this.loadingError ||= false;
            this.isLoadingTarjeta = false;
          } else {
            this.utilService.notification(
              `Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`,
              'error'
            );
            this.loadingError = true;
          }
        },
        complete: () => {
          this.utilService.closeLoading();
        },
      });
  }
}
