import { Component } from '@angular/core';

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
  public producto: IProducto;

  constructor(private productoService: ProductoService) {
    this.producto = this.productoService.get();
  }
}
