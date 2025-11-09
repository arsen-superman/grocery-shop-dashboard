import { Component, OnInit, signal, output, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { DailyRevenueSummary } from '../../core/models/revenue-data.interface';
import { ShopInfo } from '../../core/models/shop-info.interface';
import { MatCardModule } from '@angular/material/card';
import { RevenueChartComponent } from './components/revenue-chart/revenue-chart.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  fromDate: string = '2025-10-01';
  toDate: string = '2025-10-31';

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
    // read saved shop selection from cookies, default to All (0)
    const saved = this.getSelectedShopFromCookies();
    this.shopId = saved !== null ? saved : 0;

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

  onShopChange(shopId: number): void {
    // save selection to cookie whenever user changes shop via dropdown
    this.saveSelectedShop(shopId);
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
    
    this.loadData();
  }

  private saveSelectedShop(shopId: number): void {
    try {
      const days = 30;
      const expires = new Date();
      expires.setDate(expires.getDate() + days);
      const cookieValue = encodeURIComponent(String(shopId));
      document.cookie = `selectedShopId=${cookieValue}; expires=${expires.toUTCString()}; path=/`;
    } catch (e) {
        // fail silently
    }
  }

  private getSelectedShopFromCookies(): number | null {
    try {
      const cookie = document.cookie || '';
      if (!cookie) return null;
      const parts = cookie.split(';').map(p => p.trim());
      const kv = parts.find(p => p.startsWith('selectedShopId='));
      if (!kv) return null;
      const val = kv.split('=')[1] ?? '';
      const parsed = parseInt(decodeURIComponent(val), 10);
      if (isNaN(parsed)) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  onChartReady(): void {
    // Chart is ready}
  }
}