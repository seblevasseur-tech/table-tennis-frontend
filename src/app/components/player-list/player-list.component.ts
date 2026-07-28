import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreatePlayerCommand, Player, PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss',
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];
  createPlayerCommand: CreatePlayerCommand = this.getEmptyCommand();

  // Stocke l'URL temporaire pour l'aperçu de l'image
  imagePreviewUrl: string | null = null;
  error: string | null = null;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.loadPlayers();
  }

  private getEmptyCommand(): CreatePlayerCommand {
    return {
      name: '',
      forname: '',
      rating: 0,
      avatar: undefined as any
    };
  }

  loadPlayers(): void {
    this.error = null;
    this.playerService.getAllPlayers().subscribe({
      next: (players) => (this.players = players),
      error: () => (this.error = 'Erreur lors du chargement des joueurs.'),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.createPlayerCommand.avatar = file;

      // Génération de l'URL de prévisualisation locale
      this.imagePreviewUrl = URL.createObjectURL(file);
    }
  }

  addPlayer(): void {
    if (
        !this.createPlayerCommand.name ||
        !this.createPlayerCommand.forname ||
        !this.createPlayerCommand.rating ||
        !this.createPlayerCommand.avatar
    ) {
      this.error = 'Nom, prénom, classement et avatar sont requis.';
      return;
    }

    this.error = null;

    this.playerService.createPlayer(this.createPlayerCommand).subscribe({
      next: (player) => {
        this.players.push(player);
        this.resetForm();
      },
      error: () => (this.error = "Erreur lors de l'ajout du joueur."),
    });
  }

  private resetForm(): void {
    this.createPlayerCommand = this.getEmptyCommand();
    // Nettoyage de l'aperçu d'image
    if (this.imagePreviewUrl) {
      URL.revokeObjectURL(this.imagePreviewUrl);
      this.imagePreviewUrl = null;
    }
  }
}