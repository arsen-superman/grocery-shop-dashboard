import { Component, OnInit, EventEmitter, Output, signal, output, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { DailyRevenueSummary } from '../../core/models/revenue-data.interface';
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
  
  tenantId: number = 1;
  fromDate: string = '2025-10-01';
  toDate: string = '2025-10-31';

  // State
  shopName = signal('');
  revenueData = signal<DailyRevenueSummary[]>([]);
  loading = signal(false);
  error = signal('');
  
  // Output
  dataLoaded = output<{ shopName: string; fromDate: string; toDate: string }>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
  this.loading.set(true);
  this.error.set('');
  
  this.apiService
    .getShopData(this.tenantId, this.fromDate, this.toDate)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (res) => {
        this.shopName.set(res.shopName);
        this.revenueData.set(res.data);
        this.loading.set(false);
        
        this.dataLoaded.emit({ 
          shopName: res.shopName, 
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

  onChartReady(): void {
    console.log('Chart ready!');
  }
}