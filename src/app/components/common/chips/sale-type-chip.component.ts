import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleType } from 'src/app/enum/sale-type.enum';

@Component({
  selector: 'app-sale-type-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="p-x-8 p-y-4 f-w-500 rounded-pill f-s-12"
      [ngStyle]="{ 'background-color': backgroundColor, color: 'white' }"
    >
      {{ label }}
    </span>
  `,
})
export class SaleTypeChipComponent {
  @Input() type: SaleType | string = '';

  get normalizedType(): string {
    const t = (this.type || '').toString().toUpperCase();
    switch (t) {
      case SaleType.CASH:
      case 'CASH':
        return 'CASH';
      case SaleType.CREDIT:
      case 'CREDIT':
        return 'CREDIT';
      default:
        return t || '';
    }
  }

  get backgroundColor(): string {
    switch (this.normalizedType) {
      case 'CASH':
        return 'rgb(19, 222, 185)'; // green
      case 'CREDIT':
        return 'rgb(93, 135, 255)'; // blue
      default:
        return 'transparent';
    }
  }

  get label(): string {
    switch (this.normalizedType) {
      case 'CASH':
        return 'Efectivo';
      case 'CREDIT':
        return 'Crédito';
      default:
        return 'Desconocido';
    }
  }
}