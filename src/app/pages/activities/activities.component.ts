import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activities',
  imports: [CommonModule],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesComponent {
  activities = [
    { title: 'Mountain Trekking', desc: 'Guided tours through the highest peaks.' },
    { title: 'Local Cuisine', desc: 'Discover the tastes of the region.' },
    { title: 'Historic Walks', desc: 'Explore the secrets of the ancient city.' }
  ];
}
