export interface InventoryArticle {
  _id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  updatedBy: string | null;
  name: string;
  code: string;
  tax: number;
  ticketPrice: number;
  parcel: number;
  lidShopPrice: number;
  otherCosts: number;
  profit: number;
  status: string;
  publicationDate: string | null;
  description: string;
  // Optional image URL for display
  url?: string;
  promotionIds: string[];
  __v: number;
}