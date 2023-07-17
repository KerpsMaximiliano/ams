import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tambo-filter',
  templateUrl: './tambo-filter.component.html',
  styleUrls: ['./tambo-filter.component.scss'],
})
export class TamboFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  public performSearch(): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        razon_social: '',
        ent_sancor: 0,
        canal: 0,
      })
    );
  }

  public clear(localidad: HTMLInputElement, codigo: HTMLInputElement): void {}
}
