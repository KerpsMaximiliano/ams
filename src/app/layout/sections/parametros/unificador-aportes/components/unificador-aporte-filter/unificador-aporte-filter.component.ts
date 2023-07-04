import { Component, EventEmitter, Output } from '@angular/core';

// * Services
import { unificacionAporteService } from 'src/app/core/services/unificacion-aportes.service';

@Component({
  selector: 'app-unificador-aporte-filter',
  templateUrl: './unificador-aporte-filter.component.html',
  styleUrls: ['./unificador-aporte-filter.component.scss'],
})
export class UnificadorAporteFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  producto: any;

  constructor(private unificacionAporteService: unificacionAporteService) {
    this.producto = this.unificacionAporteService.get();
  }

  ngOnInit(): void {}

  public search() {
    this.searchEvent.emit();
  }
}
