import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from 'src/app/icon/icon.module';
import { SalePaymentStatusEnum } from 'src/app/enum/sale-payment-status';

@Component({
  selector: 'app-sale-payment-status-chip',
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
export class SalePaymentStatusChipComponent {
  @Input() status: SalePaymentStatusEnum | string = '';

  SalePaymentStatusEnum = SalePaymentStatusEnum;

  get normalizedStatus(): string {
    const s = (this.status || '').toString();
    switch (s) {
      case SalePaymentStatusEnum.SETTLED:
        return 'Liquidado';
      case SalePaymentStatusEnum.DELAYED:
        return 'Retrasado';
      case SalePaymentStatusEnum.PENDING:
        return 'Pendiente';
      default:
        return s;
    }
  }

  get backgroundColor(): string {
    const s = this.normalizedStatus;
    if (s === 'Liquidado') return 'rgb(19, 222, 185)'; // green
    if (s === 'Retrasado') return 'rgb(255, 174, 31)'; // yellow
    if (s === 'Pendiente') return 'rgb(244, 76, 102)'; // red (added for sales)
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