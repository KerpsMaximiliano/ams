import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public navHidden: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}
}
