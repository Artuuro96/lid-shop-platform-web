import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Base } from '../interfaces/base.interface';
import { InventoryArticle } from '../interfaces/inventory-article.interface';
import { Article } from '../interfaces/order-article.interface';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getArticles(params?: {
    category?: string;
    page?: number | string;
    limit?: number | string;
    keyword?: string;
    sortBy?: string;
    orderBy?: 'ASC' | 'DESC' | string;
    brands?: string | string[];
  }): Observable<Base<InventoryArticle[]>> {
    let httpParams = new HttpParams();
    if (params?.category) httpParams = httpParams.set('category', String(params.category));
    if (params?.page !== undefined && params?.page !== null) httpParams = httpParams.set('page', String(params.page));
    if (params?.limit !== undefined && params?.limit !== null) httpParams = httpParams.set('limit', String(params.limit));
    if (params?.keyword) httpParams = httpParams.set('keyword', String(params.keyword));
    if (params?.sortBy) httpParams = httpParams.set('sortBy', String(params.sortBy));
    if (params?.orderBy) httpParams = httpParams.set('orderBy', String(params.orderBy));
    if (params?.brands) {
      const brandsParam = Array.isArray(params.brands) ? params.brands.join(',') : String(params.brands);
      httpParams = httpParams.set('brands', brandsParam);
    }

    const url = `${this.baseUrl}/articles`;
    console.log('[ArticlesService] GET', url, 'params:', {
      category: params?.category,
      page: params?.page,
      limit: params?.limit,
      keyword: params?.keyword,
      sortBy: params?.sortBy,
      orderBy: params?.orderBy,
      brands: params?.brands,
    });
    return this.http.get<Base<InventoryArticle[]>>(url, { params: httpParams });
  }

  createArticle(payload: Partial<Article>): Observable<Base<Article>> {
    return this.http.post<Base<Article>>(`${this.baseUrl}/articles`, payload);
  }

  createArticleMultipart(articleDto: Partial<Article>, file?: File): Observable<Base<Article>> {
    const formData = new FormData();
    Object.entries(articleDto).forEach(([key, value]) => {
      // For nested objects like size, stringify as JSON
      const v = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '');
      formData.append(key, v);
    });
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.http.post<Base<Article>>(`${this.baseUrl}/articles`, formData);
  }

  updateArticle(id: string, payload: Partial<Article>): Observable<Base<Article>> {
    const url = `${this.baseUrl}/articles/${id}`;
    return this.http.patch<Base<Article>>(url, payload);
  }

  updateArticleMultipart(id: string, articleDto: Partial<Article>, file?: File): Observable<Base<Article>> {
    const formData = new FormData();
    Object.entries(articleDto).forEach(([key, value]) => {
      const v = typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '');
      formData.append(key, v);
    });
    if (file) {
      formData.append('file', file, file.name);
    }
    const url = `${this.baseUrl}/articles/${id}`;
    return this.http.patch<Base<Article>>(url, formData);
  }

  deleteArticle(id: string): Observable<Base<void>> {
    const url = `${this.baseUrl}/articles/${id}`;
    return this.http.delete<Base<void>>(url);
  }
}