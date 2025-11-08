import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { RevenueData } from '../../core/models/revenue-data.interface';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="dashboard">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Revenue Overview</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Chart will be added here -->
          <div class="chart-container">
            <p>Chart placeholder</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }
    
    .chart-container {
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class DashboardComponent implements OnInit {
  revenueData: RevenueData[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // Example date range - will be replaced with actual date picker values
    const startDate = new Date().toISOString();
    const endDate = new Date().toISOString();
    
    this.apiService.getRevenueData(startDate, endDate).subscribe({
      next: (data) => {
        this.revenueData = data;
        // Chart initialization will be added here
      },
      error: (error) => {
        console.error('Error fetching revenue data:', error);
      }
    });
  }
}