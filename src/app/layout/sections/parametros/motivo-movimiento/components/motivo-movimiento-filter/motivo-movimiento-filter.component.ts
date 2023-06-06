import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

// * Forms
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-motivo-movimiento-filter',
  templateUrl: './motivo-movimiento-filter.component.html',
  styleUrls: ['./motivo-movimiento-filter.component.scss'],
})
export class MotivoMovimientoFilterComponent {
  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('selectOptions') selectOptions: any;

  constructor() {}

  ngOnInit(): void {}

  public search(event: any, value: string): void {
    event.preventDefault();
    let selectValue = this.selectOptions?.value;
    let body = {
      par_modo: 'O',
      tipo_motivo: selectValue,
      descripcion: value,
    };
    this.searchEvent.emit(JSON.stringify(body));
  }

  public clear(inputElement: HTMLInputElement) {
    this.selectOptions.value = '';
    inputElement.value = '';
  }
}
