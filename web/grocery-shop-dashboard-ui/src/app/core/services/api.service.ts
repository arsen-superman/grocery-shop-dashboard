import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ShopInfo } from '../models/shop-info.interface';
import { RevenueData } from '../models/revenue-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getShopInfo(): Observable<ShopInfo> {
    return this.http.get<ShopInfo>(`${this.baseUrl}/api/shopdata/info`);
  }

  getRevenueData(startDate: string, endDate: string): Observable<RevenueData[]> {
    return this.http.get<RevenueData[]>(
      `${this.baseUrl}/api/shopdata/revenue?startDate=${startDate}&endDate=${endDate}`
    );
  }
}