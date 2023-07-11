import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
// * Validator
import { getErrorMessage } from 'src/app/core/validators/character.validator';

@Component({
  selector: 'app-empresa-factura-filter',
  templateUrl: './empresa-factura-filter.component.html',
  styleUrls: ['./empresa-factura-filter.component.scss'],
})
export class EmpresaFacturaFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  public searching(input: string) {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        descripcion: input,
      })
    );
  }

  public clear(input: HTMLInputElement): void {
    input.value = '';
  }
}
