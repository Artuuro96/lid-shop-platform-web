import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from 'src/app/icon/icon.module';
import { OrderStatusEnum } from 'src/app/enum/order-status.enum';

@Component({
  selector: 'app-order-status-chip',
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
export class OrderStatusChipComponent {
  @Input() status: OrderStatusEnum | string = '';

  OrderStatusEnum = OrderStatusEnum;

  get normalizedStatus(): string {
    const s = (this.status || '').toString();
    switch (s) {
      case OrderStatusEnum.DELIVERED_USA:
      case 'DELIVERED_USA':
      case OrderStatusEnum.DELIVERED_MX:
      case 'DELIVERED_MX':
      case OrderStatusEnum.DELIVERED_CLIENT:
      case 'DELIVERED_CLIENT':
        return 'Delivered';
      case OrderStatusEnum.CONFIRMED:
      case 'CONFIRMED':
        return 'Confirmed';
      case OrderStatusEnum.CREATED:
      case 'CREATED':
        return 'Created';
      default:
        return s;
    }
  }

  get backgroundColor(): string {
    const s = this.normalizedStatus;
    if (s === 'Delivered') return 'rgb(19, 222, 185)'; // green
    if (s === 'Confirmed') return 'rgb(93, 135, 255)'; // blue
    if (s === 'Created') return 'rgb(93, 135, 255)'; // blue
    return 'transparent';
  }

  get textColor(): string {
    return this.backgroundColor === 'transparent' ? 'inherit' : 'white';
  }

  get label(): string {
    const s = (this.status || '').toString();
    switch (s) {
      case OrderStatusEnum.DELIVERED_USA:
      case 'DELIVERED_USA':
        return 'Entregado (USA)';
      case OrderStatusEnum.DELIVERED_MX:
      case 'DELIVERED_MX':
        return 'Entregado (MX)';
      case OrderStatusEnum.DELIVERED_CLIENT:
      case 'DELIVERED_CLIENT':
        return 'Entregado (Cliente)';
      case OrderStatusEnum.CONFIRMED:
      case 'CONFIRMED':
        return 'Confirmado';
      case OrderStatusEnum.CREATED:
      case 'CREATED':
        return 'Creado';
      default:
        return s || 'Desconocido';
    }
  }
}