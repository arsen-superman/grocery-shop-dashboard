import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { DailyRevenueSummary } from '../../core/models/revenue-data.interface';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tenantId: number = 1;
  fromDate: string = '2025-10-01';
  toDate: string = '2025-10-31';
  shopName: string = '';
  revenueData: DailyRevenueSummary[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';
    this.apiService.getShopData(this.tenantId, this.fromDate, this.toDate).subscribe({
      next: (res) => {
        this.shopName = res.shopName;
        this.revenueData = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load data.';
        this.loading = false;
      }
    });
  }

  onFilterApply(): void {
    this.loadData();
  }
}