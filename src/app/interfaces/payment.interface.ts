export interface Payment {
  _id: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string | null;
  quantity: number;
  clientId: string;
  dateToPay: string;
  status: string;
  amountReceived?: number;
  receiptImageUrl?: string;
  receiptImageName?: string;
  __v: number;
}