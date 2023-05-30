import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmLocalidadesDashboardComponent } from './abm-localidades-dashboard.component';

describe('AbmLocalidadesDashboardComponent', () => {
  let component: AbmLocalidadesDashboardComponent;
  let fixture: ComponentFixture<AbmLocalidadesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmLocalidadesDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmLocalidadesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
