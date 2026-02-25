import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DestinationsService } from './destinations.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-destinations',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinationsComponent {
  private destinationsService = inject(DestinationsService);

  destinations = toSignal(this.destinationsService.getDestinations(), { initialValue: [] });
  searchQuery = signal<string>('');
  selectedFilter = signal<string | null>(null);
  sortOption = signal<string>('recommended'); // Default sort
  minRating = signal<number>(0);
  isSortDropdownOpen = signal<boolean>(false);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  isPriceDropdownOpen = signal<boolean>(false);
  inputMinPrice = signal<number | null>(null);
  inputMaxPrice = signal<number | null>(null);

  filteredDestinations = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const filter = this.selectedFilter();
    const sort = this.sortOption();
    const rating = this.minRating();
    const minP = this.minPrice();
    const maxP = this.maxPrice();
    const allDestinations = this.destinations();

    let result = allDestinations.filter(dest => {
      const matchesSearch = dest.name.toLowerCase().includes(query) ||
        dest.location.toLowerCase().includes(query) ||
        dest.description.toLowerCase().includes(query);

      const matchesFilter = filter ? dest.type === filter : true;
      const matchesRating = dest.rating >= rating;
      const matchesMinPrice = minP === null || dest.price >= minP;
      const matchesMaxPrice = maxP === null || dest.price <= maxP;

      return matchesSearch && matchesFilter && matchesRating && matchesMinPrice && matchesMaxPrice;
    });

    // Sorting Logic
    return result.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating; // Highest rating first
        case 'popularity':
          const popWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return popWeight[b.popularity] - popWeight[a.popularity];
        case 'recommended':
        default:
          // Recommended: High Popularity + High Rating
          const popScore = { 'High': 10, 'Medium': 5, 'Low': 1 };
          const scoreA = popScore[a.popularity] + (a.rating * 2);
          const scoreB = popScore[b.popularity] + (b.rating * 2);
          return scoreB - scoreA;
      }
    });
  });

  updateSearch(query: string) {
    this.searchQuery.set(query);
  }

  updateFilter(filter: string | null) {
    this.selectedFilter.set(filter);
  }

  updateSort(sort: string) {
    this.sortOption.set(sort);
    this.isSortDropdownOpen.set(false); // Close dropdown after selection
  }

  toggleSortDropdown() {
    this.isSortDropdownOpen.update(v => !v);
  }

  updateMinRating(rating: number) {
    this.minRating.set(rating);
  }

  updatePriceRange(min: number | null, max: number | null) {
    this.minPrice.set(min);
    this.maxPrice.set(max);
    this.isPriceDropdownOpen.set(false);
  }

  togglePriceDropdown() {
    if (!this.isPriceDropdownOpen()) {
      // Opening: Sync inputs with current applied values
      this.inputMinPrice.set(this.minPrice());
      this.inputMaxPrice.set(this.maxPrice());
    }
    this.isPriceDropdownOpen.update(v => !v);
  }
}
