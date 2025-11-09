import { Component, signal } from '@angular/core';
import { HeaderComponent } from './shared/components/header/header.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, DashboardComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  // Header-bound values
  shopName = signal('');
  fromDate = signal<string | null>(null);
  toDate = signal<string | null>(null);

  /** Handler for dashboard's dataLoaded event */
  onDataLoaded(event: { shopName?: string; fromDate?: string; toDate?: string }): void {
    debugger;
    this.shopName.set(event?.shopName ?? '');
    this.fromDate.set(event?.fromDate ?? null);
    this.toDate.set(event?.toDate ?? null);
  }
}