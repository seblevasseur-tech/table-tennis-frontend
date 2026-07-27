import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player, PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss',
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];
  newPlayer: Player = { name: '', rating: 0 };
  editingId: number | null = null;
  editingPlayer: Player = { name: '', rating: 0 };
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

  addPlayer(): void {
    if (!this.newPlayer.name || !this.newPlayer.rating) {
      this.error = 'Name and rating are required.';
      return;
    }

    this.error = null;
    this.playerService.createPlayer(this.newPlayer).subscribe({
      next: (player) => {
        this.players.push(player);
        this.newPlayer = { name: '', rating: 0 };
      },
      error: () => {
        this.error = 'Failed to add player.';
      },
    });
  }

  startEdit(player: Player): void {
    this.editingId = player.id ?? null;
    this.editingPlayer = { ...player };
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingPlayer = { name: '', rating: 0 };
  }

  updatePlayer(player: Player): void {
    if (!player.id) {
      return;
    }

    this.error = null;
    this.playerService.updatePlayer(player.id, this.editingPlayer).subscribe({
      next: (updated) => {
        const index = this.players.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          this.players[index] = updated;
        }
        this.cancelEdit();
      },
      error: () => {
        this.error = 'Failed to update player.';
      },
    });
  }

  deletePlayer(id: number | undefined): void {
    if (!id) {
      return;
    }

    if (!confirm('Are you sure you want to delete this player?')) {
      return;
    }

    this.error = null;
    this.playerService.deletePlayer(id).subscribe({
      next: () => {
        this.players = this.players.filter((p) => p.id !== id);
      },
      error: () => {
        this.error = 'Failed to delete player.';
      },
    });
  }
}
