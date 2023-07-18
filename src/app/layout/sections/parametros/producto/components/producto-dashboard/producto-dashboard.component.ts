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
import { IProducto } from 'src/app/core/models/producto.interface';

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
  selector: 'app-producto-dashboard',
  templateUrl: './producto-dashboard.component.html',
  styleUrls: ['./producto-dashboard.component.scss'],
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
export class ProductoDashboardComponent implements OnInit, OnChanges {
  @Input() public receivedData: IProducto[] = [];

  @Output() public viewEvent: EventEmitter<IProducto> =
    new EventEmitter<IProducto>();
  @Output() public editEvent: EventEmitter<IProducto> =
    new EventEmitter<IProducto>();

  expandedElement: any | null;
  public columnsToDisplay = [
    'codigo_producto',
    'descripcion_producto',
    'tipo_producto',
    'clase_producto',
    'fecha_baja_producto',
  ];
  public columnsToDisplayWithExpand = [...this.columnsToDisplay, 'actions'];
  public dataSource: MatTableDataSource<IProducto>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IProducto>(this.receivedData);
      this.dataSource.paginator = this.paginator;
      console.log(this.receivedData);
    }
  }

  public getClase(clase: string): string {
    switch (clase) {
      case 'S ':
        return 'SALUD';
      case 'L ':
        return 'CUOTA SOCIAL';
      case 'B ':
        return 'SUBSIDIO';
      case 'G ':
        return 'SUBSIDIO QUIRURGICO';
      case 'O ':
        return 'SOS (EMERGENCIA)';
      case 'V ':
        return 'VIDA';
      default:
        return 'S/D';
    }
  }

  public view(element: IProducto): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IProducto): void {
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
