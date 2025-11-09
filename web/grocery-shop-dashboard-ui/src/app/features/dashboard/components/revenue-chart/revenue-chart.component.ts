import {
  Component,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  input,
  output,
  signal,
  effect
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { DailyRevenueSummary } from '../../../../core/models/revenue-data.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Standalone component that renders a 3-line revenue chart using Google Charts.
 * Inputs:
 *  - data: DailyRevenueSummary[]
 *  - shopName: string
 *  * - height: number
 * Emits:
 *  - chartReady when the chart has been drawn successfully
 */
@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.scss']
})
export class RevenueChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  data = input<DailyRevenueSummary[]>([]);
  shopName = input('');
  height = input(380);

  // Output
  chartReady = output<void>();

  // State (signals)
  loading = signal(false);
  loadError = signal<string | null>(null);

  @ViewChild('chartContainer', { static: true }) 
  chartContainer!: ElementRef<HTMLDivElement>;

  private google: any = null;
  private chart: any = null;
  private resizeSub?: Subscription;

  constructor() {
    // Effect для відстеження змін inputs
    effect(() => {
      const currentData = this.data();
      const currentShopName = this.shopName();
      
      if (this.google && currentData.length > 0) {
        this.drawChart().catch((err) => {
          console.error('Chart draw error:', err);
          this.loadError.set('Failed to draw chart');
        });
      }
    });
  }

  ngAfterViewInit(): void {
    // Resize listener
    fromEvent(window, 'resize')
      .subscribe(() => this.redrawIfNeeded());

    // Initial draw
    if (this.data().length > 0) {
      this.drawChart().catch((err) => {
        console.error('Chart draw error:', err);
        this.loadError.set('Failed to draw chart');
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      // data changed - redraw
      this.drawChart().catch((err) => {
        console.error('Chart draw error:', err);
        this.loadError.set('Failed to draw chart');
      });
    }
    if (changes['shopName'] && !changes['shopName'].firstChange) {
      // update title
      if (this.google && this.chart) {
        this.drawChart().catch((err) => {
            console.error('Chart draw error:', err);
            this.loadError.set('Failed to draw chart');
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.resizeSub?.unsubscribe();
    this.clearChart();
  }

  /** Draw the Google LineChart using current inputs */
  async drawChart(): Promise<void> {
    this.loading.set(true);  // ← Signal update = auto change detection
    this.loadError.set(null);

    try {
      // dynamic import
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const googleCharts = await import('google-charts');
      this.google = googleCharts.google;

      // make sure google is available on window for some libs
      (window as any).google = this.google;

      this.google.charts.load('current', { packages: ['corechart'] });
      await new Promise<void>((resolve, reject) => {
        try {
          this.google.charts.setOnLoadCallback(() => resolve());
        } catch (e) {
          reject(e);
        }
      });

      const dataTable = new this.google.visualization.DataTable();
      dataTable.addColumn('string', 'Date');
      dataTable.addColumn('number', 'Income');
      dataTable.addColumn('number', 'Outcome');
      dataTable.addColumn('number', 'Revenue');

      // transform data
      const rows = this.data().map((d) => [d.date, d.income, d.outcome, d.revenue]);
      dataTable.addRows(rows);

      const options = {
        title: this.shopName || '',
        curveType: 'function',
        legend: { position: 'top', alignment: 'end' },
        series: {
          0: { color: '#e53935' },
          1: { color: '#1e88e5' },
          2: { color: '#43a047' }
        },
        vAxis: { format: '#,###' },
        hAxis: { showTextEvery: Math.max(1, Math.floor(this.data().length / 10)) },
        height: this.height,
        chartArea: { left: 60, top: 50, width: '80%', height: '70%' },
        crosshair: { trigger: 'both' },
        tooltip: { trigger: 'selection', isHtml: false },
        backgroundColor: '#ffffff',
        fontName: 'Inter, Arial, sans-serif',
        pointSize: 4,
        lineWidth: 3,
        gridlines: { color: '#f5f7fe' }
      };

      this.clearChart();
      this.chart = new this.google.visualization.LineChart(this.chartContainer.nativeElement);
      this.chart.draw(dataTable, options);
      this.chartReady.emit();
      this.loading.set(false);
    } catch (err: any) {
      this.loadError.set(err?.message || 'Failed to load chart library');
    } finally {
      this.loading.set(false);
    }
  }

  /** Clear chart DOM and state */
  private clearChart(): void {
    if (this.chartContainer && this.chartContainer.nativeElement) {
      this.chartContainer.nativeElement.innerHTML = '';
    }
    this.chart = null;
  }

  private redrawIfNeeded() {
    if (this.google && this.data().length) {
      this.drawChart().catch(() => {});
    }
  }
}
