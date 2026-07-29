import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="spotify-layout">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <div class="logo">
          <span class="icon">🏓</span>
        </div>

        <nav class="nav-menu">
          <a routerLink="/players" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👥</span>
            <span>Joueurs</span>
          </a>

          <a routerLink="/blades" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👥</span>
            <span>Bois</span>
          </a>

          <a routerLink="/rubbers" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👥</span>
            <span>Revêtements</span>
          </a>

          <div class="nav-section-title">Administration</div>

          <a routerLink="/admin/players" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">➕</span>
            <span>Ajouter des joueurs</span>
          </a>

          <a routerLink="/admin/blades" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">➕</span>
            <span>Ajouter des bois</span>
          </a>

          <a routerLink="/admin/rubbers" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">➕</span>
            <span>Ajouter des revêtements</span>
          </a>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {}