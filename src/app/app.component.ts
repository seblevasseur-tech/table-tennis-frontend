import { Component } from '@angular/core';
import { PlayerListComponent } from './components/player-list/player-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PlayerListComponent],
  template: `
    <h1>Table Tennis Players</h1>
    <app-player-list></app-player-list>
  `,
})
export class AppComponent {}
