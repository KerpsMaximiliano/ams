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
import { IDatoComercio } from 'src/app/core/models/dato-comercio.interface';

// * Animations
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-dato-comercio-dashboard',
  templateUrl: './dato-comercio-dashboard.component.html',
  styleUrls: ['./dato-comercio-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class DatoComercioDashboardComponent implements OnInit, OnChanges {
  @Input() public receivedData?: IDatoComercio[];

  @Output() public deleteEvent: EventEmitter<IDatoComercio> =
    new EventEmitter<IDatoComercio>();
  @Output() public editEvent: EventEmitter<IDatoComercio> =
    new EventEmitter<IDatoComercio>();

  @Input() public isLoading: boolean;
  @Input() public isLoadingError: boolean;

  expandedElement: any | null;
  public columnsToDisplay = [
    'forma_pago_descripcion',
    'codigo_servicio',
    'comercio',
    'banco_descripcion',
    'nro_suc',
  ];
  public columnsToDisplayWithExpand = [...this.columnsToDisplay, 'actions'];
  public dataSource: MatTableDataSource<IDatoComercio> =
    new MatTableDataSource<IDatoComercio>();

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && changes['receivedData'].currentValue) {
      this.dataSource = new MatTableDataSource<IDatoComercio>(
        this.receivedData
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  public delete(element: IDatoComercio): void {
    this.deleteEvent.emit(element);
  }

  public edit(element: IDatoComercio): void {
    this.editEvent.emit(element);
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
