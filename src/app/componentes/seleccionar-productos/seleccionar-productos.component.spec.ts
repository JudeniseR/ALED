import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarProductosComponent } from './seleccionar-productos.component';

describe('SeleccionarProductosComponent', () => {
  let component: SeleccionarProductosComponent;
  let fixture: ComponentFixture<SeleccionarProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionarProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
