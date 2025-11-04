import { Sale } from "./sale.interface";

export interface Client {
  address: string;
  age: number;
  cellphone: string;
  createdAt: string; // ISO date string
  createdBy: string;
  email: string;
  lastName: string;
  name: string;
  points: number;
  updatedAt: string; // ISO date string
  updatedBy: string | null;
  __v: number;
  _id: string;
}

export type ClientDetail = Client & {
  sales?: Sale[];
  purchasesCount?: number;
  totalSold?: number;
  points?: number;
};