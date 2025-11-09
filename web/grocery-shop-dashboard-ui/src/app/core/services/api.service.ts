import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RevenueDataResponse } from '../models/revenue-data-response.interface';
import { ShopInfo } from '../models/shop-info.interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl: string = 
    environment.apiUrl || 
    environment.apiBaseUrl || '';

  constructor(private http: HttpClient) {}

  getAllShops(): Observable<ShopInfo[]> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/shop`;

    return this.http
      .get<ShopInfo[]>(url)
      .pipe(catchError(this.handleError));
  }

  getShopRevenue(shopId: number, fromDate: string, toDate: string): Observable<RevenueDataResponse> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    const url = `${this.baseUrl.replace(/\/$/, '')}/shop/${shopId}/revenue`;

    return this.http
      .get<RevenueDataResponse>(url, { params })
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let message = 'An unknown error occurred while fetching shop data.';
    if (err.error instanceof ErrorEvent) {
      // client-side/network error
      message = `Network error: ${err.error.message}`;
    } else if (err.error && err.error.message) {
      // backend returned a structured error
      message = err.error.message;
    } else if (err.status) {
      message = `Server returned ${err.status} ${err.statusText}`;
    }

    return throwError(() => new Error(message));
  }
}