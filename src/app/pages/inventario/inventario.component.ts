import { Component } from '@angular/core';
import { ProductComponent } from '../apps/ecommerce/ecommerce.component';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [ProductComponent],
  template: `
    <app-ecommerce></app-ecommerce>
  `
})
export class InventarioComponent {}