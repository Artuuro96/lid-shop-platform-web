import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Base } from '../interfaces/base.interface';
import { Payment } from '../interfaces/payment.interface';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  registerPayment(id: string, paymentDto: Partial<Payment>, file?: File): Observable<Base<Payment>> {
    const formData = new FormData();

    Object.entries(paymentDto).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    if (file) {
      formData.append('file', file, file.name);
    }

    return this.http.patch<Base<Payment>>(`${this.baseUrl}/payments/register/${id}`, formData);
  }
}