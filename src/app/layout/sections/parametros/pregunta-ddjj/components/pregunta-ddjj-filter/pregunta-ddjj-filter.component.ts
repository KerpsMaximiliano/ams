import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pregunta-ddjj-filter',
  templateUrl: './pregunta-ddjj-filter.component.html',
  styleUrls: ['./pregunta-ddjj-filter.component.scss'],
})
export class PreguntaDDJJFilterComponent {
  @Output() public search: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('select') public select: any;

  isCleanButtonDisabled = true;

  constructor() {}

  public performSearch(): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        modelo_formulario: this.select?.value || '',
      })
    );
  }

  public clear(): void {
    this.select.value = '';
  }
}
