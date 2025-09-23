import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  currentPage = signal(1);
  pageSize = signal(5);
  total = signal(0);

  totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));
  skip = computed(() => (this.currentPage() - 1) * this.pageSize());

  setTotal(total: number) {
    this.total.set(total);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  next() {
    if (this.currentPage() < this.totalPages())
      this.currentPage.update((p) => p + 1);
  }

  prev() {
    if (this.currentPage() > 1) this.currentPage.update((p) => p - 1);
  }
}
