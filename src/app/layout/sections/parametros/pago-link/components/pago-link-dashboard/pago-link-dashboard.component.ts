import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

// * Interfaces
import { IPagoLink } from 'src/app/core/models/pago-link.interface';

// * Material
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pago-link-dashboard',
  templateUrl: './pago-link-dashboard.component.html',
  styleUrls: ['./pago-link-dashboard.component.scss'],
})
export class PagoLinkDashboardComponent implements OnInit, OnChanges {
  public displayedColumns: string[] = [
    'codigo_forma_pago',
    'descripcion_forma_pago',
    'actions',
  ];
  public dataSource: MatTableDataSource<IPagoLink>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: IPagoLink[] = [];
  @Output() public deletEvent: EventEmitter<IPagoLink> =
    new EventEmitter<IPagoLink>();

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}

  ngOnInit(): void {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IPagoLink>(this.receivedData);
      this.dataSource.paginator = this.paginator;
    }
  }

  public delet(element: IPagoLink): void {
    this.deletEvent.emit(element);
  }
}
