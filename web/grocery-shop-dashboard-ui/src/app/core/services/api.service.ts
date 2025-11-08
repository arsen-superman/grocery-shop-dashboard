import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RevenueDataResponse } from '../models/revenue-data-response.interface';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // prefer apiUrl, fallback to apiBaseUrl for backwards compatibility
  private readonly baseUrl: string = (environment as any).apiUrl || (environment as any).apiBaseUrl || '';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Fetches shop data for a tenant in the given date range.
   * GET {baseUrl}/shop-data?tenantId={id}&fromDate={date}&toDate={date}
   */
  getShopData(tenantId: number, fromDate: string, toDate: string): Observable<RevenueDataResponse> {
    const params = new HttpParams()
      .set('tenantId', String(tenantId))
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    const url = `${this.baseUrl.replace(/\/$/, '')}/shop-data`;

    this.loadingSubject.next(true);

    return this.http.get<RevenueDataResponse>(url, { params }).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  private handleError(err: HttpErrorResponse) {
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