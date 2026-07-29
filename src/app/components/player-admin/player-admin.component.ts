import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { CreatePlayerCommand } from '../../model/player';
import { Blade } from '../../model/blade';
import { Rubber } from '../../model/rubber';
import { BladeService } from '../../services/blade.service';
import { RubberService } from '../../services/rubber.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-player-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './player-admin.component.html',
    styleUrl: './player-admin.component.scss',
})
export class PlayerAdminComponent implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    createPlayerCommand: CreatePlayerCommand = this.getEmptyPlayerCommand();
    imagePlayerPreviewUrl: string | null = null;
    blades: Blade[] = [];
    rubbers: Rubber[] = [];
    error: string | null = null;
    isSubmitting = false;
    isBladeDropdownOpen = false;
    rubberDropdownOpen: 'forehand' | 'backhand' | null = null;

    constructor(
        private playerService: PlayerService,
        private bladeService: BladeService,
        private rubberService: RubberService,
    ) {}

    ngOnInit(): void {
        forkJoin({
            blades: this.bladeService.getAllBlades(),
            rubbers: this.rubberService.getAllRubbers(),
        }).subscribe({
            next: ({ blades, rubbers }) => { this.blades = blades; this.rubbers = rubbers; },
            error: () => { this.error = 'Impossible de charger les équipements disponibles.'; },
        });
    }

    private getEmptyPlayerCommand(): CreatePlayerCommand {
        return {
            name: '',
            forname: '',
            avatar: null,
            handedness: null,
            bladeId: null,
            forehandRubberId: null,
            backhandRubberId: null,
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

    get selectedBlade(): Blade | undefined {
        return this.blades.find(blade => blade.id === this.createPlayerCommand.bladeId);
    }

    toggleBladeDropdown(): void {
        this.isBladeDropdownOpen = !this.isBladeDropdownOpen;
    }

    selectBlade(blade: Blade): void {
        this.createPlayerCommand.bladeId = blade.id;
        this.isBladeDropdownOpen = false;
    }

    get selectedForehandRubber(): Rubber | undefined {
        return this.rubbers.find(rubber => rubber.id === this.createPlayerCommand.forehandRubberId);
    }

    get selectedBackhandRubber(): Rubber | undefined {
        return this.rubbers.find(rubber => rubber.id === this.createPlayerCommand.backhandRubberId);
    }

    toggleRubberDropdown(side: 'forehand' | 'backhand'): void {
        this.rubberDropdownOpen = this.rubberDropdownOpen === side ? null : side;
    }

    selectRubber(side: 'forehand' | 'backhand', rubber: Rubber): void {
        if (side === 'forehand') {
            this.createPlayerCommand.forehandRubberId = rubber.id;
        } else {
            this.createPlayerCommand.backhandRubberId = rubber.id;
        }
        this.rubberDropdownOpen = null;
    }

    addPlayer(): void {
        if (
            !this.createPlayerCommand.name ||
            !this.createPlayerCommand.forname ||
            !this.createPlayerCommand.avatar ||
            !this.createPlayerCommand.handedness ||
            !this.createPlayerCommand.bladeId ||
            !this.createPlayerCommand.forehandRubberId ||
            !this.createPlayerCommand.backhandRubberId
        ) {
            this.error = 'Tous les champs ainsi que la photo d’avatar sont requis.';
            return;
        }

        this.error = null;
        this.isSubmitting = true;
        this.playerService.createPlayer(this.createPlayerCommand).subscribe({
            next: () => { this.isSubmitting = false; this.resetForm(); },
            error: () => { this.isSubmitting = false; this.error = "Erreur lors de l'ajout du joueur."; },
        });
    }

    private resetForm(): void {
        this.createPlayerCommand = this.getEmptyPlayerCommand();
        this.isBladeDropdownOpen = false;
        this.rubberDropdownOpen = null;
        if (this.imagePlayerPreviewUrl) {
            URL.revokeObjectURL(this.imagePlayerPreviewUrl);
            this.imagePlayerPreviewUrl = null;
        }
        if (this.fileInput) this.fileInput.nativeElement.value = '';
    }
}
