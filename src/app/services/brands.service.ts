import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Base } from '../interfaces/base.interface';

export interface Brand {
  _id?: string;
  name: string;
  descripcion?: string;
  siglas?: string;
}

@Injectable({ providedIn: 'root' })
export class BrandsService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBrands(): Observable<Base<Brand[]>> {
    return this.http.get<Base<Brand[]>>(`${this.baseUrl}/brands`);
  }

  createBrand(payload: Omit<Brand, '_id'>): Observable<Base<Brand>> {
    return this.http.post<Base<Brand>>(`${this.baseUrl}/brands`, payload);
  }
}