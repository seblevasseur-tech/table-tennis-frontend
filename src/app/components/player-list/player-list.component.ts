import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import {Player} from "../../model/player";

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss',
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];
  error: string | null = null;

  constructor(private playerService: PlayerService) {}

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