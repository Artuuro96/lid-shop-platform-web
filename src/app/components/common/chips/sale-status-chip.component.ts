import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from 'src/app/icon/icon.module';
import { SaleStatusEnum } from 'src/app/enum/sale-status.enum';

@Component({
  selector: 'app-sale-status-chip',
  standalone: true,
  imports: [CommonModule, IconModule],
  template: `
    <span
      class="p-x-8 p-y-4 f-w-500 rounded-pill f-s-12"
      [ngStyle]="{ 'background-color': backgroundColor, color: textColor }"
    >
      {{ label }}
    </span>
  `,
})
export class SaleStatusChipComponent {
  @Input() status: SaleStatusEnum | string = '';

  SaleStatusEnum = SaleStatusEnum;

  get normalizedStatus(): string {
    const s = (this.status || '').toString();
    // Map enum-like values to readable names similar to invoice list
    switch (s) {
      case SaleStatusEnum.CONFIRMED:
      case 'CONFIRMED':
        return 'Delivered';
      case SaleStatusEnum.DELIVERED:
      case 'DELIVERED':
        return 'Delivered';
      case SaleStatusEnum.PENDING:
      case 'PENDING':
        return 'Pending';
      case SaleStatusEnum.CANCELED:
      case 'CANCELED':
        return 'Canceled';
      case SaleStatusEnum.CREATED:
      case 'CREATED':
        return 'Created';
      default:
        return s;
    }
  }

  get backgroundColor(): string {
    const s = this.normalizedStatus;
    if (s === 'Shipped') return 'rgb(93, 135, 255)'; // blue like invoice list
    if (s === 'Delivered') return 'rgb(19, 222, 185)'; // green
    if (s === 'Pending') return 'rgb(255, 174, 31)'; // yellow
    if (s === 'Canceled') return 'rgb(244, 76, 102)'; // red (added for sales)
    if (s === 'Created') return 'rgb(93, 135, 255)'; // reuse blue
    return 'transparent';
  }

  get textColor(): string {
    return this.backgroundColor === 'transparent' ? 'inherit' : 'white';
  }

  get label(): string {
    const s = this.normalizedStatus;
    // Prefer Spanish labels to match the rest of Client Detail
    switch (s) {
      case 'Delivered':
        return 'Entregado';
      case 'Pending':
        return 'Pendiente';
      case 'Confirmed':
        return 'Confirmado';
      case 'Canceled':
        return 'Cancelado';
      case 'Created':
        return 'Creado';
      default:
        return s || 'Desconocido';
    }
  }
}