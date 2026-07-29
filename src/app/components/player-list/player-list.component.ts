import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../model/player';
import { COUNTRIES } from '../../model/country';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss',
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];
  error: string | null = null;
  searchTerm = '';

  constructor(private playerService: PlayerService) {}

  get filteredPlayers(): Player[] {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) return this.players;
    return this.players.filter((player) => {
      const country = COUNTRIES.find((item) => item.code === player.countryCode);
      return [player.forname, player.name, player.countryCode, country?.name || '']
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }



  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.error = null;
    this.playerService.getAllPlayers().subscribe({
      next: (players) => (this.players = players),
      error: () => (this.error = 'Erreur lors du chargement des joueurs.'),
    });
  }
}