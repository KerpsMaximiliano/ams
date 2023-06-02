import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/layout/sections/parametros/abm-localidades/abm-localidades.component.spec.ts
import { AbmLocalidadesComponent } from './abm-localidades.component';

describe('AbmLocalidadesComponent', () => {
  let component: AbmLocalidadesComponent;
  let fixture: ComponentFixture<AbmLocalidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmLocalidadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmLocalidadesComponent);
========
import { ProvinciaComponent } from './provincia.component';

describe('ProvinciaComponent', () => {
  let component: ProvinciaComponent;
  let fixture: ComponentFixture<ProvinciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvinciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinciaComponent);
>>>>>>>> 754405b1d239a1b629e7759f41fa32212da32ab1:src/app/layout/sections/parametros/provincia/provincia.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
