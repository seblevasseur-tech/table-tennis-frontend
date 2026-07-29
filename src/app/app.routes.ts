import { Routes } from '@angular/router';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { PlayerAdminComponent } from './components/player-admin/player-admin.component';
import { PlayerDetailComponent } from './components/player-detail/player-detail.component';
import {BladeListComponent} from "./components/blade-list/blade-list.component";
import {RubberListComponent} from "./components/rubber-list/rubber-list.component";
import {BladeAdminComponent} from "./components/blade-admin/blade-admin.component";
import {RubberAdminComponent} from "./components/rubber-admin/rubber-admin.component";

export const routes: Routes = [
    { path: '', redirectTo: 'players', pathMatch: 'full' },
    { path: 'players', component: PlayerListComponent },
    { path: 'players/:id', component: PlayerDetailComponent },
    { path: 'blades', component: BladeListComponent },
    { path: 'rubbers', component: RubberListComponent },
    { path: 'admin/players', component: PlayerAdminComponent },
    { path: 'admin/blades', component: BladeAdminComponent },
    { path: 'admin/rubbers', component: RubberAdminComponent },
    { path: '**', redirectTo: 'players' }
];