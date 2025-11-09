import { Component, input, output, computed, signal, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { DailyRevenueSummary } from '../../../../core/models/revenue-data.interface';
import { debounceTime, fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [GoogleChartsModule],
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.scss']
})
export class RevenueChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { read: ElementRef }) chartContainer?: ElementRef<HTMLDivElement>;
  data = input<DailyRevenueSummary[]>([]);
  shopName = input('');
  height = input(380);

  chartReady = output<void>();

  chartType: ChartType = ChartType.LineChart;

  containerWidth = signal(1200);

  private resizeSubscription?: Subscription;
  
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

  chartOptions = computed(() => {
    const width = this.containerWidth();
    const leftMargin = 80;
    const rightMargin = 40;
    const chartAreaWidth = width - leftMargin - rightMargin;

    console.log('Chart width:', width, 'Chart area width:', chartAreaWidth);

    return {
      title: 'Revenue Chart',
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
        left: leftMargin, 
        top: 60,
        width: chartAreaWidth,
        height: '70%' 
      },
      backgroundColor: '#ffffff',
      pointSize: 5,
      lineWidth: 2
    };
  });

  chartWidth = computed(() => this.containerWidth());
  chartHeight = computed(() => this.height());

  private updateContainerWidth(): void {
    if (this.chartContainer) {
      const width = this.chartContainer.nativeElement.offsetWidth;
      console.log('Container width:', width);
      
      const chartWidth = width - 64;
      
      this.containerWidth.set(chartWidth);
    }
  }

  onChartReady(): void {
    console.log('Chart rendered successfully!');
    this.chartReady.emit();
  }

  onChartError(error: any): void {
    console.error('Chart error:', error);
  }

  ngAfterViewInit(): void {
    this.updateContainerWidth();

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => {
        console.log('Window resized, updating chart width');
        this.updateContainerWidth();
      });
  }

  ngOnDestroy(): void {
    this.resizeSubscription?.unsubscribe();
  }
}