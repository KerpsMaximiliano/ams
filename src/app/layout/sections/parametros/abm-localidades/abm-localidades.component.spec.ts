import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
