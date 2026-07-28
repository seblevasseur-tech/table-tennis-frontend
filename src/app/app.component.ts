import { Component } from '@angular/core';
import { PlayerListComponent } from './components/player-list/player-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PlayerListComponent],
  template: `
    <app-player-list></app-player-list>
  `,
})
export class AppComponent {}
