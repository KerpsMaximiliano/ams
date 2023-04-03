import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmLocalidadesFilterComponent } from './abm-localidades-filter.component';

describe('AbmLocalidadesFilterComponent', () => {
  let component: AbmLocalidadesFilterComponent;
  let fixture: ComponentFixture<AbmLocalidadesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmLocalidadesFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmLocalidadesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
