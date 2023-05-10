import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinciaDashboardComponent } from './provincia-dashboard.component';

describe('TipoProvinciaDashboardComponent', () => {
  let component: ProvinciaDashboardComponent;
  let fixture: ComponentFixture<ProvinciaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvinciaDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinciaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
