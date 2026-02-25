import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AmbientBackgroundComponent } from './shared/components/ambient-background/ambient-background.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, AmbientBackgroundComponent],
  templateUrl: './app.html',
})
export class App {
  title = 'ELEVÉ';
}
