import { Routes } from '@angular/router';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { PlayerAdminComponent } from './components/player-admin/player-admin.component';

export const routes: Routes = [
    { path: '', redirectTo: 'players', pathMatch: 'full' },
    { path: 'players', component: PlayerListComponent },
    { path: 'admin/add', component: PlayerAdminComponent },
    { path: '**', redirectTo: 'players' }
];