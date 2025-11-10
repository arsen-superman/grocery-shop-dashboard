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
  
        if (!rawData || rawData.length === 0) {
            return [['Date', 'Income', 'Outcome', 'Revenue']];
        }

        if (rawData.length > 90) {
            const weeklyData = this.aggregateByWeek(rawData);
            const rows = weeklyData.map(d => [new Date(d.date), d.income, d.outcome, d.revenue]);
            return rows;
        }

        const rows = rawData.map(d => [new Date(d.date), d.income, d.outcome, d.revenue]);
        return rows
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

    ngAfterViewInit(): void {
        this.updateContainerWidth();

        this.resizeSubscription = fromEvent(window, 'resize')
            .pipe(debounceTime(200))
            .subscribe(() => {
                this.updateContainerWidth();
            });
    }

    ngOnDestroy(): void {
        this.resizeSubscription?.unsubscribe();
    }

    private updateContainerWidth(): void {
        if (this.chartContainer) {
            const width = this.chartContainer.nativeElement.offsetWidth;
            const chartWidth = width - 64;

            this.containerWidth.set(chartWidth);
        }
    }

    private aggregateByWeek(data: DailyRevenueSummary[]): DailyRevenueSummary[] {
        const weekMap = new Map<string, { income: number; outcome: number; revenue: number; count: number }>();

        data.forEach(item => {
            const date = new Date(item.date);
            const weekStart = this.getWeekStart(date);
            const weekKey = weekStart.toISOString().split('T')[0];

            const existing = weekMap.get(weekKey) || { income: 0, outcome: 0, revenue: 0, count: 0 };
            weekMap.set(weekKey, {
                income: existing.income + item.income,
                outcome: existing.outcome + item.outcome,
                revenue: existing.revenue + item.revenue,
                count: existing.count + 1
            });
        });

        return Array.from(weekMap.entries()).map(([date, values]) => ({
            date,
            income: values.income,
            outcome: values.outcome,
            revenue: values.revenue
        }));
    }

    private getWeekStart(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as week start
        return new Date(d.setDate(diff));
    }

    onChartReady(): void {
        this.chartReady.emit();
    }

    onChartError(error: any): void {
        console.error('Chart error:', error);
    }
}