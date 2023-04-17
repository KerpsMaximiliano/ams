import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinciaFilterComponent } from './provincia-filter.component';

describe('ProvinciaFilterComponent', () => {
  let component: ProvinciaFilterComponent;
  let fixture: ComponentFixture<ProvinciaFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvinciaFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinciaFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
