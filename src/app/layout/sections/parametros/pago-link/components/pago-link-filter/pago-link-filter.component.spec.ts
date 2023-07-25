import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoLinkFilterComponent } from './pago-link-filter.component';

describe('PagoLinkFilterComponent', () => {
  let component: PagoLinkFilterComponent;
  let fixture: ComponentFixture<PagoLinkFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoLinkFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoLinkFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
