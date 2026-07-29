import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import {CreatePlayerCommand} from "../../model/player";
import {CreateBladeCommand} from "../../model/blade";
import {CreateRubberCommand} from "../../model/rubber";
import {BladeService} from "../../services/blade.service";
import {RubberService} from "../../services/rubber.service";

@Component({
    selector: 'app-player-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './player-admin.component.html',
    styleUrl: './player-admin.component.scss',
})
export class PlayerAdminComponent {
    createPlayerCommand: CreatePlayerCommand = this.getEmptyPlayerCommand();
    createBladeCommand: CreateBladeCommand = this.getEmptyBladeCommand();
    createRubberCommand: CreateRubberCommand = this.getEmptyRubberCommand();

    imagePlayerPreviewUrl: string | null = null;
    imageBladePreviewUrl: string | null = null;
    imageRubberPreviewUrl: string | null = null;

    error: string | null = null;
    isSubmitting = false;

    constructor(
        private playerService: PlayerService,
        private bladeService: BladeService,
        private rubberService: RubberService,
        private router: Router
    ) {}

    private getEmptyPlayerCommand(): CreatePlayerCommand {
        return {
            name: '',
            forname: '',
            rating: null as any,
            avatar: undefined as any,
        };
    }

    private getEmptyBladeCommand(): CreateBladeCommand {
        return {
            brand: '',
            name: '',
            avatar: undefined as any,
        };
    }

    private getEmptyRubberCommand(): CreateRubberCommand {
        return {
            brand: '',
            name: '',
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
                // Redirection vers la liste publique après ajout réussi
                // this.router.navigate(['/players']);
            },
            error: () => {
                this.isSubmitting = false;
                this.error = "Erreur lors de l'ajout du joueur.";
            },
        });
    }

    addBlade(): void {
        if (
            !this.createBladeCommand.brand ||
            !this.createBladeCommand.name ||
            !this.createBladeCommand.avatar
        ) {
            this.error = 'Tous les champs ainsi que la photo d’avatar sont requis.';
            return;
        }

        this.error = null;
        this.isSubmitting = true;

        this.bladeService.createBlade(this.createBladeCommand).subscribe({
            next: () => {
                this.isSubmitting = false;
                // Redirection vers la liste publique après ajout réussi
                // this.router.navigate(['/players']);
            },
            error: () => {
                this.isSubmitting = false;
                this.error = "Erreur lors de l'ajout du bois.";
            },
        });
    }

    addRubber(): void {
        if (
            !this.createRubberCommand.brand ||
            !this.createRubberCommand.name ||
            !this.createRubberCommand.avatar
        ) {
            this.error = 'Tous les champs ainsi que la photo d’avatar sont requis.';
            return;
        }

        this.error = null;
        this.isSubmitting = true;

        this.rubberService.createRubber(this.createRubberCommand).subscribe({
            next: () => {
                this.isSubmitting = false;
                // Redirection vers la liste publique après ajout réussi
                // this.router.navigate(['/players']);
            },
            error: () => {
                this.isSubmitting = false;
                this.error = "Erreur lors de l'ajout du revêtement.";
            },
        });
    }
}