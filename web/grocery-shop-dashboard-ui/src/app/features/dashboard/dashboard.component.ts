import { Component, OnInit, signal, output, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { DailyRevenueSummary } from '../../core/models/revenue-data.interface';
import { ShopInfo } from '../../core/models/shop-info.interface';
import { MatCardModule } from '@angular/material/card';
import { RevenueChartComponent } from './components/revenue-chart/revenue-chart.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const COOKIE_KEYS = {
  SHOP_ID: 'grocery_dashboard_shop_id',
  FROM_DATE: 'grocery_dashboard_from_date',
  TO_DATE: 'grocery_dashboard_to_date'
} as const;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, RevenueChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  
  shopId: number = 0;
  fromDate: string = '2021-06-01';
  toDate: string = '2021-12-31';

  // State
  shopName = signal('');
  revenueData = signal<DailyRevenueSummary[]>([]);
  loading = signal(false);
  error = signal('');

  // shops list for filter selection
  shops = signal<ShopInfo[]>([]);
  loadingShops = signal(false);
  
  // Output
  dataLoaded = output<{ fromDate: string; toDate: string }>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // read saved filters from cookies
    const savedFilters = this.getFiltersFromCache();

    // apply saved values or keep defaults
    this.shopId = savedFilters.shopId ?? this.shopId;
    this.fromDate = savedFilters.fromDate ?? this.fromDate;
    this.toDate = savedFilters.toDate ?? this.toDate;

    this.loadShops();
  }

  loadShops(): void {
    this.loadingShops.set(true);
    this.error.set('');

    this.apiService
      .getAllShops()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const allShops: ShopInfo[] = [{ shopId: 0, name: 'All' }, ...res];
          this.shops.set(allShops);
          this.loadingShops.set(false);
          this.loadData();
        },
        error: (err: any) => {
          this.error.set(err?.message || 'Failed to load shops');
          this.loadingShops.set(false);
        }
      });
  }

  loadData(): void {
  this.loading.set(true);
  this.error.set('');
  
  this.apiService
    .getShopRevenue(this.shopId, this.fromDate, this.toDate)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (res) => {
        this.revenueData.set(res.data);
        this.loading.set(false);
        
        this.dataLoaded.emit({ 
          fromDate: this.fromDate, 
          toDate: this.toDate 
        });
      },
      error: (err) => {
        this.error.set(err?.message || 'Failed to load data.');
        this.loading.set(false);
      }
    });
}

  onFilterApply(): void {
    if (this.fromDate > this.toDate) {
      this.error.set('From date cannot be after To date');
      return;
    }
    
    // save filters before loading new data
    this.saveFiltersToCache();
    this.loadData();
  }

  /** Save all filter values to cookies */
  private saveFiltersToCache(): void {
    try {
      const days = 30;
      const expires = new Date();
      expires.setDate(expires.getDate() + days);
      
      // helper to set a cookie with consistent options
      const setCookie = (key: string, value: string) => {
        document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
      };

      // save all filter values
      setCookie(COOKIE_KEYS.SHOP_ID, String(this.shopId));
      setCookie(COOKIE_KEYS.FROM_DATE, this.fromDate);
      setCookie(COOKIE_KEYS.TO_DATE, this.toDate);
    } catch (e) {
      // swallow errors - cookies may be disabled
    }
  }

  /** Read all filter values from cookies */
  private getFiltersFromCache(): { shopId: number | null; fromDate: string | null; toDate: string | null } {
    try {
      const cookie = document.cookie || '';
      if (!cookie) {
        return { shopId: null, fromDate: null, toDate: null };
      }

      // helper to get a cookie value by key
      const getCookieValue = (key: string): string | null => {
        const parts = cookie.split(';').map(p => p.trim());
        const kv = parts.find(p => p.startsWith(`${key}=`));
        if (!kv) return null;
        const val = kv.split('=')[1] ?? '';
        return decodeURIComponent(val);
      };

      // read and parse each value
      const shopIdStr = getCookieValue(COOKIE_KEYS.SHOP_ID);
      const fromDate = getCookieValue(COOKIE_KEYS.FROM_DATE);
      const toDate = getCookieValue(COOKIE_KEYS.TO_DATE);

      return {
        shopId: shopIdStr ? parseInt(shopIdStr, 10) : null,
        fromDate: fromDate || null,
        toDate: toDate || null
      };
    } catch (e) {
      return { shopId: null, fromDate: null, toDate: null };
    }
  }

  onChartReady(): void {
    // Chart is ready}
  }
}