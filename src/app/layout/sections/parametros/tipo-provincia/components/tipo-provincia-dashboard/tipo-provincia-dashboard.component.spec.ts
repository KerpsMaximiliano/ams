import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoProvinciaDashboardComponent } from './tipo-provincia-dashboard.component';

describe('TipoProvinciaDashboardComponent', () => {
  let component: TipoProvinciaDashboardComponent;
  let fixture: ComponentFixture<TipoProvinciaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoProvinciaDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoProvinciaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
