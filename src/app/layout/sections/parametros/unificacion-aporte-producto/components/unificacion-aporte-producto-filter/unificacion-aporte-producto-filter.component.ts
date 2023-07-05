import { Component, EventEmitter, Output } from '@angular/core';

// * Services
import { UnificacionAporteProductoService } from 'src/app/core/services/unificacion-aporte-producto.service';

@Component({
  selector: 'app-unificacion-aporte-producto-filter',
  templateUrl: './unificacion-aporte-producto-filter.component.html',
  styleUrls: ['./unificacion-aporte-producto-filter.component.scss'],
})
export class UnificacionAporteProductoFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  producto: any;

  @Output() public search: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(private unificacionAporteProductoService: UnificacionAporteProductoService) {
    this.producto = this.unificacionAporteProductoService.get();
  }
  
  public performSearch(): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        
      })
    );
  }
}
