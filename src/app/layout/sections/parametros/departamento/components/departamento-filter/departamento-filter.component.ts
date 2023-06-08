import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

// * Services
import { UtilService } from 'src/app/core/services/util.service';
import { ProvinciaService } from '../../../../../../core/services/provincia.service';

// * Interfaces
import { IProvincia } from 'src/app/core/models/provincia.interface';

@Component({
  selector: 'app-departamento-filter',
  templateUrl: './departamento-filter.component.html',
  styleUrls: ['./departamento-filter.component.scss'],
})
export class DepartamentoFilterComponent implements AfterViewInit {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('selectOptions') selectOptions: any;

  provincias: IProvincia[] = [];

  constructor(
    private utils: UtilService,
    private provinciaService: ProvinciaService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.utils.openLoading();
    this.provinciaService
      .CRUD(
        JSON.stringify({
          par_modo: 'O',
          nombre_provincia: '',
        })
      )
      .subscribe({
        next: (res: any) => {
          res.dataset.length
            ? (this.provincias = res.dataset as IProvincia[])
            : (this.provincias = [res.dataset]);
        },
        complete: () => {
          this.utils.closeLoading();
        },
      });
  }

  public search(event: any, value: string): void {
    event.preventDefault();
    let selectValue = this.selectOptions?.value;
    let body = {
      par_modo: 'O',
      letra_provincia: selectValue,
      descripcion: value,
    };
    this.searchEvent.emit(JSON.stringify(body));    
  }

  public clear(inputElement: HTMLInputElement) {
    this.selectOptions.value = '';
    inputElement.value = '';
  }
}
