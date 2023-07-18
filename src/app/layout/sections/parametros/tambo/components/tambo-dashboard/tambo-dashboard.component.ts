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
import { ITambo } from 'src/app/core/models/tambo.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-tambo-dashboard',
  templateUrl: './tambo-dashboard.component.html',
  styleUrls: ['./tambo-dashboard.component.scss'],
})
export class TamboDashboardComponent implements OnInit, OnChanges {
  public displayedColumns: string[] = [
    'id_tambos',
    'razon_social',
    'estado',
    'actions',
  ];
  public dataSource: MatTableDataSource<ITambo>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: ITambo[] = [];
  @Output() public viewEvent: EventEmitter<ITambo> = new EventEmitter<ITambo>();
  @Output() public editEvent: EventEmitter<ITambo> = new EventEmitter<ITambo>();

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<ITambo>(this.receivedData);
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: ITambo): void {
    this.viewEvent.emit(element);
  }

  public edit(element: ITambo): void {
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
