import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CreatePlayerCommand, Player, PlayerService} from '../../services/player.service';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss',
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];
  player: Player | undefined;
  createPlayerCommand: CreatePlayerCommand | undefined;
  error: string | null = null;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.error = null;
    this.playerService.getAllPlayers().subscribe({
      next: (players) => {
        this.players = players;
      },
      error: () => {
        this.error = 'Failed to load players.';
      },
    });
  }

// Gestion de la sélection d'image
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.player && input.files && input.files.length > 0) {
      this.player.avatar = input.files[0];
    }
  }

  addPlayer(): void {
    console.log('add player submit')
    if (!this.createPlayerCommand
        || !this.createPlayerCommand.name
        || !this.createPlayerCommand.forname
        || !this.createPlayerCommand.rating
        || !this.createPlayerCommand.avatar) {
      this.error = 'Nom, prénom, classement et avatar sont requis.';
      return;
    }

    this.error = null;

    // Si ton PlayerService gère FormData pour envoyer le fichier + l'objet :
    this.playerService.createPlayer(this.createPlayerCommand).subscribe({
      next: (player) => {
        this.players.push(player);
        this.createPlayerCommand = undefined;
        console.log('added player')
      },
      error: () => (this.error = "Erreur lors de l'ajout du joueur."),
    });
  }
}
