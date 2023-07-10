import {
  Component,
  Input,
  ViewChild,
  SimpleChanges,
  EventEmitter,
  Output,
  OnChanges,
  OnInit,
} from '@angular/core';

// * Interfaces
import { IAtributosRelacionCapitaPlan } from 'src/app/core/models/atributos-relacion-capita-plan.interface';

// * Material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-atributos-relacion-capita-plan-dashboard',
  templateUrl: './atributos-relacion-capita-plan-dashboard.component.html',
  styleUrls: ['./atributos-relacion-capita-plan-dashboard.component.scss'],
})
export class AtributosRelacionCapitaPlanDashboardComponent
  implements OnInit, OnChanges
{
  public displayedColumns: string[] = [
    'plan_producto_cap_adm',
    'descripcion',
    'genera_liquidacion',
    'actions',
  ];
  public dataSource: MatTableDataSource<IAtributosRelacionCapitaPlan>;
  @ViewChild(MatPaginator, { static: true }) public paginator!: MatPaginator;

  @Input() public receivedData: IAtributosRelacionCapitaPlan[] = [];
  @Output() public viewEvent: EventEmitter<IAtributosRelacionCapitaPlan> =
    new EventEmitter<IAtributosRelacionCapitaPlan>();
  @Output() public editEvent: EventEmitter<IAtributosRelacionCapitaPlan> =
    new EventEmitter<IAtributosRelacionCapitaPlan>();

  constructor(private matPaginatorIntl: MatPaginatorIntl) {}
  ngOnInit(): void {
    this.configurePaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receivedData'] && !changes['receivedData'].firstChange) {
      this.dataSource = new MatTableDataSource<IAtributosRelacionCapitaPlan>(
        this.receivedData
      );
      this.dataSource.paginator = this.paginator;
    }
  }

  public view(element: IAtributosRelacionCapitaPlan): void {
    this.viewEvent.emit(element);
  }

  public edit(element: IAtributosRelacionCapitaPlan): void {
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
