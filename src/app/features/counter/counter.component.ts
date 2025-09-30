import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CounterStore } from '../../store/counter/counter.signal-store';

@Component({
  selector: 'app-counter',
  imports: [FormsModule],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css',
})
export class CounterComponent {
  readonly counterStore = inject(CounterStore);
  addAmount: number = 0;
}
