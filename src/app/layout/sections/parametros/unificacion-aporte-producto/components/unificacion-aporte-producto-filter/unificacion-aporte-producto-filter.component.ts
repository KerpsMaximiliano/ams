import { Component, EventEmitter, Output } from '@angular/core';

// * Interfaces
import { IProducto } from 'src/app/core/models/producto.interface';

// * Services
import { ProductoService } from 'src/app/core/services/producto.service';

@Component({
  selector: 'app-unificacion-aporte-producto-filter',
  templateUrl: './unificacion-aporte-producto-filter.component.html',
  styleUrls: ['./unificacion-aporte-producto-filter.component.scss'],
})
export class UnificacionAporteProductoFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();
  public producto: IProducto;
  
  constructor(private productoService: ProductoService) {
    this.producto = this.productoService.get();
  }
  
  public performSearch(): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'R',
        producto_principal: this.producto.codigo_producto,
        subproducto_principal: this.producto.producto_administrador
      })
    );
  }
}
