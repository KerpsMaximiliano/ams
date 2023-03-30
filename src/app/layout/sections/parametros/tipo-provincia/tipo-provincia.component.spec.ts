import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoProvinciaComponent } from './tipo-provincia.component';

describe('TipoProvinciaComponent', () => {
  let component: TipoProvinciaComponent;
  let fixture: ComponentFixture<TipoProvinciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoProvinciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoProvinciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
