import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Base } from '../interfaces/base.interface';
import { SaleStatusEnum } from '../enum/sale-status.enum';
import { SalePaymentStatusEnum } from '../enum/sale-payment-status';
import { SaleType } from '../enum/sale-type.enum';
import { Order } from '../interfaces/order.interface';

export interface SaleApi {
  _id: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string | null;
  saleId: string;
  advance: number;
  articleIds: string[];
  debt: number;
  paymentMethod: string;
  paymentsNumber: number;
  paymentIds: string[];
  total: number;
  type: SaleType;
  status: SaleStatusEnum; // e.g. "DELIVERED"
  paymentStatus: SalePaymentStatusEnum; // e.g. "SETTLED"
  clientId: string;
  clientName: string;
  vendorName: string;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSales(): Observable<Base<Order[]>> {
    return this.http.get<Base<Order[]>>(`${this.baseUrl}/orders`);
  }

  getOrderById(id: string): Observable<Base<Order>> {
    return this.http.get<Base<Order>>(`${this.baseUrl}/orders/${id}`);
  }
}