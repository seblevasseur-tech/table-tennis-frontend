import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../model/player';
import { COUNTRIES, Country } from '../../model/country';

@Component({
    selector: 'app-player-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './player-detail.component.html',
    styleUrl: './player-detail.component.scss',
})
export class PlayerDetailComponent implements OnInit {
    player: Player | null = null;
    isLoading = true;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private playerService: PlayerService,
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        if (!id) {
            this.error = 'Joueur introuvable.';
            this.isLoading = false;
            return;
        }

        this.playerService.getPlayerById(id).subscribe({
            next: (player) => {
                this.player = player;
                this.isLoading = false;
            },
            error: () => {
                this.error = 'Impossible de charger les informations du joueur.';
                this.isLoading = false;
            },
        });
    }

    get handednessLabel(): string {
        return this.player?.handedness === 'LEFT' ? 'Gaucher' : 'Droitier';
    }

    get country(): Country | undefined {
        return COUNTRIES.find(country => country.code === this.player?.countryCode);
    }
}
