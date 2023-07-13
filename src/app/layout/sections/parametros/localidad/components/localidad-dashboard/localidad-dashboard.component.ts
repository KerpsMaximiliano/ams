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
import { ILocalidad } from 'src/app/core/models/localidad.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-localidad-dashboard',
  templateUrl: './localidad-dashboard.component.html',
  styleUrls: ['./localidad-dashboard.component.scss'],
})
export class LocalidadDashboardComponent implements OnInit, OnChanges {
  public displayedColumns: string[] = [
    'codigo_postal',
    'sub_codigo_postal',
    'descripcion',
    'desc_prov',
    'desc_depto',
    'desc_position',
    'cant_habitantes',
    'actions',
  ];
  public dataSource: MatTableDataSource<ILocalidad>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: ILocalidad[] = [];
  @Output() public viewEvent: EventEmitter<ILocalidad> =
    new EventEmitter<ILocalidad>();
  @Output() public editEvent: EventEmitter<ILocalidad> =
    new EventEmitter<ILocalidad>();

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<ILocalidad>(this.receivedData);
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: ILocalidad): void {
    this.viewEvent.emit(element);
  }

  public edit(element: ILocalidad): void {
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
