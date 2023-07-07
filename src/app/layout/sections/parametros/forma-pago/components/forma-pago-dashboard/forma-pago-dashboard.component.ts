import {
  Component,
  Input,
  ViewChild,
  OnInit,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';

// * Interfaces
import { IFormaPago } from 'src/app/core/models/formas-pago.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-forma-pago-dashboard',
  templateUrl: './forma-pago-dashboard.component.html',
  styleUrls: ['./forma-pago-dashboard.component.scss'],
})
export class FormaPagoDashboardComponent implements OnInit, OnChanges {
  @Input() public receivedData: IFormaPago[] = [];

  @Output() public viewEvent: EventEmitter<IFormaPago> =
    new EventEmitter<IFormaPago>();
  @Output() public editEvent: EventEmitter<IFormaPago> =
    new EventEmitter<IFormaPago>();

  public displayedColumns: string[] = [
    'codigo',
    'forma_pago',
    'description',
    'nombre_tarjeta_nemot',
    'desc_banco',
    'codigo_tarjeta_de_baja',
    'actions',
  ];
  public dataSource: MatTableDataSource<IFormaPago>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IFormaPago>(this.receivedData);
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: IFormaPago): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IFormaPago): void {
    this.editEvent.emit(element);
  }

  public getFormaPagoDescripcion(formaPago: string): string {
    switch (formaPago) {
      case 'BSF':
        return 'Débitos Automáticos';
      case 'LNK':
        return 'Pagos RED LINK';
      case 'CBU':
        return 'Transferencia Bancaria';
      case 'TC ':
        return 'Tarjeta Crédito';
      default:
        return '';
    }
  }

  private configurePaginator(): void {
    this.paginator._intl = this.matPaginatorIntl;
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página: ';
    this.paginator._intl.nextPageLabel = 'Página siguiente.';
    this.paginator._intl.previousPageLabel = 'Página anterior.';
    this.paginator._intl.firstPageLabel = 'Primer página.';
    this.paginator._intl.lastPageLabel = 'Última página.';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ): string => {
      return length
        ? `Página ${page + 1} de ${Math.ceil(length / pageSize)}`
        : 'Página 0 de 0';
    };
  }
}
