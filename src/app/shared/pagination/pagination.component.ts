import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
  effect,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() total = 0;
  @Input() pageSize = 5;
  @Input() set currentPage(value: number) {
    if (value && value !== this._currentPage()) {
      this._currentPage.set(value);
    }
  }
  @Output() pageChange = new EventEmitter<number>();

  private readonly _currentPage = signal(1);
  currentPageValue = computed(() => this._currentPage());
  totalPages = computed(() => Math.ceil(this.total / this.pageSize));

  get getCurrentPage() {
    return this._currentPage();
  }

  nextPage() {
    if (this._currentPage() < this.totalPages()) {
      this._currentPage.update((p) => p + 1);
      this.pageChange.emit(this._currentPage());
    }
  }

  previousPage() {
    if (this._currentPage() > 1) {
      this._currentPage.update((p) => p - 1);
      this.pageChange.emit(this._currentPage());
    }
  }
}
