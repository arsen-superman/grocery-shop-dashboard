import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    FormsModule
  ],
  template: `
    <header class="header">
      <h1>Grocery Shop Dashboard</h1>
      <div class="date-range">
        <mat-form-field>
          <mat-label>Start date</mat-label>
          <input matInput [matDatepicker]="startPicker" [(ngModel)]="startDate">
          <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
        </mat-form-field>
        <mat-form-field>
          <mat-label>End date</mat-label>
          <input matInput [matDatepicker]="endPicker" [(ngModel)]="endDate">
          <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
          <mat-datepicker #endPicker></mat-datepicker>
        </mat-form-field>
      </div>
    </header>
  `,
  styles: [`
    .header {
      padding: 1rem;
      background-color: #f5f5f5;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .date-range {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    
    h1 {
      margin: 0 0 1rem;
      color: #333;
    }
  `]
})
export class HeaderComponent {
  startDate: Date | null = null;
  endDate: Date | null = null;
}