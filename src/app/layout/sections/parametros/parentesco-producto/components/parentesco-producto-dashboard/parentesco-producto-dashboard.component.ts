import {
  Component,
  Input,
  ViewChild,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';

// * Interfaces
import { IParentescoProducto } from 'src/app/core/models/parentesco-producto.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-parentesco-producto-dashboard',
  templateUrl: './parentesco-producto-dashboard.component.html',
  styleUrls: ['./parentesco-producto-dashboard.component.scss'],
})
export class ParentescoProductoDashboardComponent {
  public displayedColumns: string[] = [
    'codigo_parentesco',
    'descripcion',
    'permite_darse_baja',
    'pide_fecha_enlace',
    'codigo_afip',
    'actions',
  ];
  public dataSource: MatTableDataSource<IParentescoProducto>;
  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: IParentescoProducto[] = [];
  @Output() public viewEvent: EventEmitter<IParentescoProducto> =
    new EventEmitter<IParentescoProducto>();
  @Output() public editEvent: EventEmitter<IParentescoProducto> =
    new EventEmitter<IParentescoProducto>();

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}
  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IParentescoProducto>(this.receivedData);
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: IParentescoProducto): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IParentescoProducto): void {
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
