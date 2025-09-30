import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CounterStore } from '../../store/counter/counter.signal-store';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [FormsModule],
  providers: [CounterStore],
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
})
export class CounterComponent {
  readonly counterStore = inject(CounterStore);
  addAmount: number = 0;
}
