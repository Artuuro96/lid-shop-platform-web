export interface Sale {
  date: string | Date;
  orderId: string;
  items: number;
  total: number;
  status: string;
  type: string;
  paymentStatus: string;
}