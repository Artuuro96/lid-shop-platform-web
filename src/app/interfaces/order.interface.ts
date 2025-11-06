import { Article } from './order-article.interface';
import { Payment } from './payment.interface';

export interface Order {
  _id: string,
  createdAt: string,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string | null,
  orderId: string,
  vendorName: string,
  clientName: string,
  clientId: string,
  total: number,
  status: string,
  orderPaymentStatus: string,
  articlesOrder?: Article[],
  paymentIds?: string[],
  payments?: Payment[];
}