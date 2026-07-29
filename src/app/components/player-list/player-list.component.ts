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
  nameSearchTerm = '';
  countryFilter = '';
  countries = COUNTRIES;

  constructor(private playerService: PlayerService) {}

  get filteredPlayers(): Player[] {
    const nameQuery = this.nameSearchTerm.trim().toLowerCase();
    return this.players.filter((player) => {
      const matchesName = !nameQuery ||
        (player.forname + ' ' + player.name).toLowerCase().includes(nameQuery);
      const matchesCountry = !this.countryFilter || player.countryCode === this.countryFilter;
      return matchesName && matchesCountry;
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