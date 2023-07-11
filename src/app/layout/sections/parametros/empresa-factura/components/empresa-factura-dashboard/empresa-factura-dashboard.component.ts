import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
// * Interfaces
import { IEmpresaFactura } from 'src/app/core/models/empresa-factura.interface';
// * Material
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-empresa-factura-dashboard',
  templateUrl: './empresa-factura-dashboard.component.html',
  styleUrls: ['./empresa-factura-dashboard.component.scss'],
})
export class EmpresaFacturaDashboardComponent {
  public displayedColumns: string[] = ['codigo', 'name', 'actions'];
  public dataSource: MatTableDataSource<IEmpresaFactura>;

  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: IEmpresaFactura[] = [];
  @Output() public viewEvent: EventEmitter<IEmpresaFactura> =
    new EventEmitter<IEmpresaFactura>();
  @Output() public editEvent: EventEmitter<IEmpresaFactura> =
    new EventEmitter<IEmpresaFactura>();

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
      this.dataSource = new MatTableDataSource<IEmpresaFactura>(
        this.receivedData
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: IEmpresaFactura): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IEmpresaFactura): void {
    this.editEvent.emit(element);
  }
}
