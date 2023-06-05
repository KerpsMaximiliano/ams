import { Component, EventEmitter, Output } from '@angular/core';

// * Forms
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-motivo-movimiento-filter',
  templateUrl: './motivo-movimiento-filter.component.html',
  styleUrls: ['./motivo-movimiento-filter.component.scss'],
})
export class MotivoMovimientoFilterComponent {
  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();
  
  body: any;

  public descripcion = new UntypedFormControl('');
  public tipo_motivo = new UntypedFormControl('');

  constructor() {}

  ngOnInit(): void {}

  public search(event: any, value: string): void {
    event.preventDefault();
    this.body = {
      par_modo: 'C',
      tipo_motivo: this.tipo_motivo.value[0],
      descripcion: this.descripcion.value,
    };
    this.searchEvent.emit(this.body);
  }

  public clear(inputElement: HTMLInputElement) {
    inputElement.value = '';
    this.descripcion.setValue('');
    this.tipo_motivo.setValue('');
  }
}
