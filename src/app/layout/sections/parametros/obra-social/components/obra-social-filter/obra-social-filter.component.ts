import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-obra-social-filter',
  templateUrl: './obra-social-filter.component.html',
  styleUrls: ['./obra-social-filter.component.scss'],
})
export class ObraSocialFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  public performSearch(value: string): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        descripcion: value,
      })
    );
  }

  public clear(inputElement: HTMLInputElement): void {
    inputElement.value = '';
  }
}
