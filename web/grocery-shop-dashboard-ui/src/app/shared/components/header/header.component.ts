import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // Inputs
  shopName = input('');
  fromDate = input<string | null>(null);
  toDate = input<string | null>(null);

  // Computed signal
  displayRange = computed(() => {
    const from = this.fromDate();
    const to = this.toDate();
    
    if (!from || !to) return '';
    
    try {
      const f = new Date(from);
      const t = new Date(to);
      const opts: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const fStr = f.toLocaleDateString('en-US', opts);
      const tStr = t.toLocaleDateString('en-US', opts);
      return `${fStr} - ${tStr}`;
    } catch {
      return `${from} - ${to}`;
    }
  });
}