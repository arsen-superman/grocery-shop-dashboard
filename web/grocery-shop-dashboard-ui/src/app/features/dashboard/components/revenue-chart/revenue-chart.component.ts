import { Component, input, output, computed } from '@angular/core';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { DailyRevenueSummary } from '../../../../core/models/revenue-data.interface';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [GoogleChartsModule],
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.scss']
})
export class RevenueChartComponent {
  data = input<DailyRevenueSummary[]>([]);
  shopName = input('');
  height = input(380);

  chartReady = output<void>();

  chartType: ChartType = ChartType.LineChart;
  
  // Columns
  chartColumns = ['Date', 'Income', 'Outcome', 'Revenue'];
  
  // Data
  chartData = computed(() => {
    const rawData = this.data();
    
    console.log('=== CHART DATA COMPUTATION ===');
    console.log('Raw data length:', rawData?.length);
    
    if (!rawData || rawData.length === 0) {
      console.log('No data');
      return [];
    }

    const rows = rawData.map((d, index) => {
      const dateObj = new Date(d.date);
      
      if (index === 0) {
        console.log('First row:', [dateObj, d.income, d.outcome, d.revenue]);
      }
      
      return [dateObj, d.income, d.outcome, d.revenue];
    });
    
    console.log('Total rows:', rows.length);
    console.log('=== END CHART DATA ===');
    
    return rows;
  });

  chartOptions = computed(() => ({
    title: this.shopName() || 'Revenue Chart',
    curveType: 'function',
    legend: { position: 'top', alignment: 'end' },
    series: {
      0: { color: '#e53935' }, // Income - Red
      1: { color: '#1e88e5' }, // Outcome - Blue
      2: { color: '#43a047' }  // Revenue - Green
    },
    vAxis: { 
      format: '#,###',
      title: 'Amount'
    },
    hAxis: { 
      title: 'Date',
      format: 'MMM dd'
    },
    chartArea: { 
      left: 80, 
      top: 60, 
      width: '82%', 
      height: '70%' 
    },
    backgroundColor: '#ffffff',
    pointSize: 5,
    lineWidth: 2
  }));

  chartWidth = 900;
  chartHeight = computed(() => this.height());

  onChartReady(): void {
    console.log('Chart rendered successfully!');
    this.chartReady.emit();
  }

  onChartError(error: any): void {
    console.error('Chart error:', error);
  }
}