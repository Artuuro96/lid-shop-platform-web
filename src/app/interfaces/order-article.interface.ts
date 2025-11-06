export interface ArticleSize {
  height: number | null;
  width: number | null;
  deep: number | null;
}

export interface Article {
  code: string;
  name: string;
  brandId: string;
  ticketPrice: number;
  tax: number;
  parcel: number;
  exchangeValue: number;
  otherCosts: number;
  lidShopPrice: number;
  profit: number;
  status: string;
  publicationDate: string | null;
  description: string | null;
  size: ArticleSize;
}