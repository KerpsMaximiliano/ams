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

// * Interface
import { ICondicionIva } from 'src/app/core/models/condicion-iva.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-condicion-iva-dashboard',
  templateUrl: './condicion-iva-dashboard.component.html',
  styleUrls: ['./condicion-iva-dashboard.component.scss'],
})
export class CondicionIvaDashboardComponent implements OnInit, OnChanges {
  @Input() public receivedData: ICondicionIva[] = [];

  @Output() public viewEvent: EventEmitter<ICondicionIva> =
    new EventEmitter<ICondicionIva>();
  @Output() public editEvent: EventEmitter<ICondicionIva> =
    new EventEmitter<ICondicionIva>();

  public displayedColumns: string[] = [
    'codigo_de_IVA',
    'descripcion',
    'descripcion_reducida',
    'formulario_AB',
    'actions',
  ];
  public dataSource: MatTableDataSource<ICondicionIva>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<ICondicionIva>(
        this.receivedData
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: ICondicionIva): void {
    this.viewEvent.emit(element);
  }

  public edit(element: ICondicionIva): void {
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
