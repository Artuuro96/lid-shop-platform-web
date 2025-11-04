import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client, ClientDetail } from '../interfaces/client.interface';
import { Base } from '../interfaces/base.interface';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getClients(): Observable<Base<Client[]>> {
    return this.http.get<Base<Client[]>>(`${this.baseUrl}/clients`);
  }

  getClientById(id: string): Observable<Base<ClientDetail>> {
    return this.http.get<Base<ClientDetail>>(`${this.baseUrl}/clients/${id}`);
  }

  updateClient(id: string, payload: Partial<Client> | FormData): Observable<Base<Client>> {
    return this.http.patch<Base<Client>>(`${this.baseUrl}/clients/${id}`, payload);
  }

  deleteClient(id: string): Observable<Base<void>> {
    return this.http.delete<Base<void>>(`${this.baseUrl}/clients/${id}`);
  }

  createClient(payload: Partial<Client>): Observable<Base<Client>> {
    return this.http.post<Base<Client>>(`${this.baseUrl}/clients`, payload);
  }
}