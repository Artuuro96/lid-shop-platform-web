import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Base } from '../interfaces/base.interface';

export interface Category {
  _id?: string;
  name: string;
  descripcion?: string;
  siglas?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Base<Category[]>> {
    return this.http.get<Base<Category[]>>(`${this.baseUrl}/categories`);
  }

  createCategory(payload: Omit<Category, '_id'>): Observable<Base<Category>> {
    return this.http.post<Base<Category>>(`${this.baseUrl}/categories`, payload);
  }
}