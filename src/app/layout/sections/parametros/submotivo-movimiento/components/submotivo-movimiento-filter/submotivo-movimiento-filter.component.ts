import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SubmotivoMovimientoService } from 'src/app/core/services/submotivo-movimiento.service';
// * Interfaces
import { ISubmotivoMovimiento } from 'src/app/core/models/submotivo-movimiento';

@Component({
  selector: 'app-submotivo-movimiento-filter',
  templateUrl: './submotivo-movimiento-filter.component.html',
  styleUrls: ['./submotivo-movimiento-filter.component.scss'],
})
export class SubmotivoMovimientoFilterComponent {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  movimiento: ISubmotivoMovimiento =
    this.SubmotivoMovimientoService.get();
    descripcion: string;

  constructor(private SubmotivoMovimientoService: SubmotivoMovimientoService) {
  }

  ngOnInit() {
  }

  public search(input: string) {
    this.searchEvent.emit(input);
  }

  public clearInputs(): void {
    this.descripcion='';
  }
}
