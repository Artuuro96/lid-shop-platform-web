import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentStatusEnum } from 'src/app/enum/payment-status.enum';

@Component({
  selector: 'app-payment-status-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="p-x-8 p-y-4 f-w-500 f-s-12"
      [ngStyle]="{ 'background-color': backgroundColor, color: textColor, 'border-radius': '6px' }"
    >
      {{ label }}
    </span>
  `,
})
export class PaymentStatusChipComponent {
  @Input() status: PaymentStatusEnum | string = '';

  PaymentStatusEnum = PaymentStatusEnum;

  private normalize(s: string): PaymentStatusEnum | string {
    const up = (s || '').toString().toUpperCase();
    switch (up) {
      case PaymentStatusEnum.PENDING:
      case PaymentStatusEnum.VALIDATING:
      case PaymentStatusEnum.DELAYED:
      case PaymentStatusEnum.CONFIRMED:
        return up as PaymentStatusEnum;
      default:
        return s;
    }
  }

  get label(): string {
    const s = this.normalize(this.status as string);
    switch (s) {
      case PaymentStatusEnum.PENDING:
        return 'Pendiente';
      case PaymentStatusEnum.VALIDATING:
        return 'Validando';
      case PaymentStatusEnum.DELAYED:
        return 'Retrasado';
      case PaymentStatusEnum.CONFIRMED:
        return 'Confirmado';
      default:
        return (this.status || 'Desconocido').toString();
    }
  }

  get backgroundColor(): string {
    const s = this.normalize(this.status as string);
    if (s === PaymentStatusEnum.CONFIRMED) return 'rgb(19, 222, 185)';
    if (s === PaymentStatusEnum.VALIDATING) return 'rgb(66, 165, 245)';
    if (s === PaymentStatusEnum.DELAYED) return 'rgb(244, 76, 102)';
    if (s === PaymentStatusEnum.PENDING) return 'rgb(255, 174, 31)';
    return 'transparent';
  }

  get textColor(): string {
    return this.backgroundColor === 'transparent' ? 'inherit' : 'white';
  }
}