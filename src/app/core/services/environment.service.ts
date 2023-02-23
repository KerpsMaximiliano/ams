import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor() { }

  get production() {
    return environment.production;
  }

  get api() {
    return environment.api;
  }

  get baseUrlKeycloak() {
    return environment.baseUrlKeycloak;
  }
}
