import { SaleStatusEnum } from "../enum/sale-status.enum";

export const getChipPaymentStatus = (status: string) => {
  switch (status) {
    case SaleStatusEnum.DELIVERED:
      return {
        label: 'Pendiente',
        color: 'warn',
        icon: 'truck'
      };
    case SaleStatusEnum.CONFIRMED:
      return {
        label: 'Completado',
        color: 'primary',
        icon: 'check'
      };
    case SaleStatusEnum.CANCELED:
      return {
        label: 'Fallido',
        color: 'accent',
        icon: 'x'
      };
    case SaleStatusEnum.PENDING:
      return {
        label: 'Pendiente',
        color: 'warn',
        icon: 'clock'
      };
    case SaleStatusEnum.CREATED:
      return {
        label: 'Creado',
        color: 'primary',
        icon: 'circle-dot'
      };
    default:
      return {
        label: 'Desconocido',
        color: 'secondary',
        icon: 'alert-circle'
      };
  }
};