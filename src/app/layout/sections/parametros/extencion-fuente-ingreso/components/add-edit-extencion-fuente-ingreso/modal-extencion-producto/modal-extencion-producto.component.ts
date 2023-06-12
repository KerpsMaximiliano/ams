import { UtilService } from 'src/app/core/services/util.service';
import { ExtencionFuenteIngresoService } from 'src/app/core/services/extencion-fuente-ingreso.service'; 
import { ProductoService } from 'src/app/core/services/producto.service';

// * Interfaces
import { IProducto } from 'src/app/core/models/producto.interface';
import { IExtencionFuenteIngreso } from 'src/app/core/models/extencion-fuente-ingreso.interface';

// * Material
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';

// * Others
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-modal-extencion-producto',
  templateUrl: './modal-extencion-producto.component.html',
  styleUrls: ['./modal-extencion-producto.component.scss']
})

export class ModalExtencionProductoComponent {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), this.cdr);  searchValue: string;
  displayedColumns: string[] = [
    'codigo_producto',
    'descripcion',
    'codigo_subproducto',
    'subdescripcion',
    'actions'];
  selectedItem: any = {
    producto_principal:'',
    descripcion_producto_cod:0,
    subproducto_principal:'',
    subproducto_principal_cod: 0
  };
  selectedParam: any;
  selection= [];
  allProduct: IExtencionFuenteIngreso[];
  productosTabla: IProducto[];
  productos: IProducto[];
  dataSource: MatTableDataSource<IExtencionFuenteIngreso>;

  constructor( public dialogRef: MatDialogRef<any>, 
                private _extencionFuenteIngreso: ExtencionFuenteIngresoService,
                private _liveAnnouncer: LiveAnnouncer,
                private _productoService: ProductoService,
                private _utils: UtilService,
                private cdr: ChangeDetectorRef,
                ) { }
  
  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página: ';
    this.paginator._intl.nextPageLabel = 'Página siguiente.';
    this.paginator._intl.previousPageLabel = 'Página anterior.';
    this.paginator._intl.firstPageLabel = 'Primer página.';
    this.paginator._intl.lastPageLabel = 'Ultima página.';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ): string => {
      return length
        ? 'Página ' + (page + 1) + ' de ' + Math.ceil(length / pageSize)
        : 'Página 0 de 0';
    };
    let body = {
      par_modo: 'L',
      descripcion: ''
    }
    this._productoService.getProductoCRUD(JSON.stringify(body)).subscribe({ 
      next: (respuesta) =>{
        this.productos = respuesta.dataset.filter( filtroprod => filtroprod.tipo_producto == "P");
      },
    })
  }

  public announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  
  closeDialog(): void {
    this.dialogRef.close(false);
  }

  onCheckboxChange(row: any) {
    this.selectedParam = row;
    if (this.selection.length < 1){
      if (row) {
        this.selection = row;
      } else {
        this.selection=[];
      }
    }
    this.selectedItem.producto_principal =  this.getproducto(row.producto_principal);
    this.selectedItem.descripcion_producto_cod = row.producto_principal;
  }

  selected(){
    this.dialogRef.close(this.selectedItem);
  }
  
  public search(inputprod: any): void {
    this.getProductos(inputprod);
  }

  getproducto(prod:number) {    
    const producto = this.productos.find((filtro:any) => filtro.codigo_producto === prod);
    return producto ? producto.descripcion_producto : ''
  }
  
  private getProductos(inputprod: any): void {
      this._utils.openLoading();
      this._extencionFuenteIngreso.CRUD(JSON.stringify({
        par_modo: "O",
        producto_principal: ''// this.searchProd_cod
      })).subscribe({
      next:(res:any) => { 
        this._utils.closeLoading();
        this.allProduct = res.dataset as IExtencionFuenteIngreso[];
        this.allProduct = res.dataset.filter (
          (filtro:any) => parseInt(filtro.producto_principal) == inputprod)
          this.dataSource = new MatTableDataSource<IExtencionFuenteIngreso>(this.allProduct);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.paginator._intl.getRangeLabel = (): string => {
              return "Página " +  (this.paginator.pageIndex + 1) + " de " +  (Math.floor(this.paginator.length / this.paginator.pageSize)+1)
            }
          }, 100)
        },
        error:(err: any) => {
          this._utils.closeLoading();
          (err.status == 0)
            ? this._utils.notification('Error de conexión', 'error') 
            : this._utils.notification(`Status Code ${err.error.estado.Codigo}: ${err.error.estado.Mensaje}`, 'error')
          },
        complete: () => {
          this._utils.closeLoading();
        }
      });
    }
  }