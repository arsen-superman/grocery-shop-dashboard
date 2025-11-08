import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <p>&copy; 2025 Grocery Shop Dashboard. All rights reserved.</p>
    </footer>
  `,
  styles: [`
    .footer {
      padding: 1rem;
      background-color: #f5f5f5;
      text-align: center;
      position: fixed;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #ddd;
    }
    
    p {
      margin: 0;
      color: #666;
    }
  `]
})
export class FooterComponent {}