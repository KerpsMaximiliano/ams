import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';

@Component({
  selector: 'app-posicion-filter',
  templateUrl: './posicion-filter.component.html',
  styleUrls: ['./posicion-filter.component.scss'],
})
export class PosicionFilterComponent {
  @Input() public provincias: IProvincia[];

  @ViewChild('select') public select: any;

  @Output() public search: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  public performSearch(value: string): void {
    this.search.emit(
      JSON.stringify({
        par_modo: 'O',
        letra_provincia: this.select?.value,
        descripcion: value,
      })
    );
  }

  public clear(inputElement: HTMLInputElement): void {
    this.select.value = '';
    inputElement.value = '';
  }
}
