import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clock',
  imports: [CommonModule],
  template: `
    <div class="text-neutral-700 font-semibold text-sm">
      {{ currentTime() }}
    </div>
  `,
})
export class ClockComponent implements OnInit, OnDestroy {
  currentTime = signal('');
  private intervalId: any;

  ngOnInit() {
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateTime() {
    const now = new Date();
    this.currentTime.set(
      now.toLocaleString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    );
  }
}
