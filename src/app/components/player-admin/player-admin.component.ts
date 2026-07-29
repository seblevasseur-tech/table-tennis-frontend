import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { CreatePlayerCommand } from "../../model/player";

@Component({
    selector: 'app-player-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './player-admin.component.html',
    styleUrl: './player-admin.component.scss',
})
export class PlayerAdminComponent {
    createPlayerCommand: CreatePlayerCommand = this.getEmptyPlayerCommand();
    imagePlayerPreviewUrl: string | null = null;

    error: string | null = null;
    isSubmitting = false;

    constructor(private playerService: PlayerService) {}

    private getEmptyPlayerCommand(): CreatePlayerCommand {
        return {
            name: '',
            forname: '',
            rating: null as any,
            avatar: undefined as any,
        };
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.createPlayerCommand.avatar = file;
            this.imagePlayerPreviewUrl = URL.createObjectURL(file);
        }
    }

    addPlayer(): void {
        if (
            !this.createPlayerCommand.name ||
            !this.createPlayerCommand.forname ||
            !this.createPlayerCommand.rating ||
            !this.createPlayerCommand.avatar
        ) {
            this.error = 'Tous les champs ainsi que la photo d’avatar sont requis.';
            return;
        }

        this.error = null;
        this.isSubmitting = true;

        this.playerService.createPlayer(this.createPlayerCommand).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.resetForm(); // <--- Remet le formulaire à zéro
            },
            error: () => {
                this.isSubmitting = false;
                this.error = "Erreur lors de l'ajout du joueur.";
            },
        });
    }

    private resetForm(): void {
        this.createPlayerCommand = this.getEmptyPlayerCommand();
        if (this.imagePlayerPreviewUrl) {
            URL.revokeObjectURL(this.imagePlayerPreviewUrl);
            this.imagePlayerPreviewUrl = null;
        }
    }
}