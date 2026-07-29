import { Component, ElementRef, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { PlayerService } from '../../services/player.service';
import { CreatePlayerCommand } from '../../model/player';
import { Blade } from '../../model/blade';
import { Rubber } from '../../model/rubber';
import { BladeService } from '../../services/blade.service';
import { RubberService } from '../../services/rubber.service';

@Component({
    selector: 'app-player-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './player-admin.component.html',
    styleUrl: './player-admin.component.scss',
})
export class PlayerAdminComponent implements OnInit, OnDestroy {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    createPlayerCommand: CreatePlayerCommand = this.getEmptyPlayerCommand();
    imagePlayerPreviewUrl: string | null = null;
    blades: Blade[] = [];
    rubbers: Rubber[] = [];

    // Recherche dans les dropdowns
    bladeSearchQuery = '';
    forehandSearchQuery = '';
    backhandSearchQuery = '';

    error: string | null = null;
    successMessage: string | null = null;
    isSubmitting = false;
    isLoading = true;
    currentStep = 1;

    isBladeDropdownOpen = false;
    rubberDropdownOpen: 'forehand' | 'backhand' | null = null;

    private subscription = new Subscription();

    constructor(
        private playerService: PlayerService,
        private bladeService: BladeService,
        private rubberService: RubberService,
    ) {}

    ngOnInit(): void {
        this.subscription.add(
            forkJoin({
                blades: this.bladeService.getAllBlades(),
                rubbers: this.rubberService.getAllRubbers(),
            }).subscribe({
                next: ({ blades, rubbers }) => {
                    this.blades = blades;
                    this.rubbers = rubbers;
                    this.isLoading = false;
                },
                error: () => {
                    this.error = 'Impossible de charger les équipements disponibles.';
                    this.isLoading = false;
                },
            })
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.revokePreviewUrl();
    }

    // Fermer les dropdowns si clic à l'extérieur
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (!target.closest('.equipment-dropdown')) {
            this.closeAllDropdowns();
        }
    }

    private getEmptyPlayerCommand(): CreatePlayerCommand {
        return {
            name: '',
            forname: '',
            avatar: null,
            information: '',
            handedness: null,
            bladeId: null,
            forehandRubberId: null,
            backhandRubberId: null,
        };
    }

    autoResize(event: Event): void {
        const textarea = event.target as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.revokePreviewUrl();
            this.createPlayerCommand.avatar = file;
            this.imagePlayerPreviewUrl = URL.createObjectURL(file);
        }
    }

    removeAvatar(event: Event): void {
        event.stopPropagation();
        this.revokePreviewUrl();
        this.createPlayerCommand.avatar = null;
        if (this.fileInput) this.fileInput.nativeElement.value = '';
    }

    setHandedness(value: 'RIGHT' | 'LEFT'): void {
        this.createPlayerCommand.handedness = value;
    }

    // Getters pour les sélectionnées
    get selectedBlade(): Blade | undefined {
        return this.blades.find((b) => b.id === this.createPlayerCommand.bladeId);
    }

    get selectedForehandRubber(): Rubber | undefined {
        return this.rubbers.find((r) => r.id === this.createPlayerCommand.forehandRubberId);
    }

    get selectedBackhandRubber(): Rubber | undefined {
        return this.rubbers.find((r) => r.id === this.createPlayerCommand.backhandRubberId);
    }

    // Listes filtrées pour la recherche
    get filteredBlades(): Blade[] {
        if (!this.bladeSearchQuery.trim()) return this.blades;
        const q = this.bladeSearchQuery.toLowerCase();
        return this.blades.filter((b) => `${b.brand} ${b.name}`.toLowerCase().includes(q));
    }

    get filteredForehandRubbers(): Rubber[] {
        if (!this.forehandSearchQuery.trim()) return this.rubbers;
        const q = this.forehandSearchQuery.toLowerCase();
        return this.rubbers.filter((r) => `${r.brand} ${r.name}`.toLowerCase().includes(q));
    }

    get filteredBackhandRubbers(): Rubber[] {
        if (!this.backhandSearchQuery.trim()) return this.rubbers;
        const q = this.backhandSearchQuery.toLowerCase();
        return this.rubbers.filter((r) => `${r.brand} ${r.name}`.toLowerCase().includes(q));
    }

    nextStep(): void {
        if (
            !this.createPlayerCommand.name ||
            !this.createPlayerCommand.forname ||
            !this.createPlayerCommand.avatar ||
            !this.createPlayerCommand.handedness
        ) {
            this.error = 'Complétez le profil avant de continuer.';
            this.successMessage = null;
            return;
        }

        this.error = null;
        this.currentStep = 2;
    }

    previousStep(): void {
        this.error = null;
        this.currentStep = 1;
    }

    // Toggles & Selection
    toggleBladeDropdown(): void {
        const nextState = !this.isBladeDropdownOpen;
        this.closeAllDropdowns();
        this.isBladeDropdownOpen = nextState;
        this.bladeSearchQuery = '';
    }

    toggleRubberDropdown(side: 'forehand' | 'backhand'): void {
        const nextState = this.rubberDropdownOpen === side ? null : side;
        this.closeAllDropdowns();
        this.rubberDropdownOpen = nextState;
        this.forehandSearchQuery = '';
        this.backhandSearchQuery = '';
    }

    selectBlade(blade: Blade): void {
        this.createPlayerCommand.bladeId = blade.id;
        this.isBladeDropdownOpen = false;
    }

    selectRubber(side: 'forehand' | 'backhand', rubber: Rubber): void {
        if (side === 'forehand') {
            this.createPlayerCommand.forehandRubberId = rubber.id;
        } else {
            this.createPlayerCommand.backhandRubberId = rubber.id;
        }
        this.rubberDropdownOpen = null;
    }

    private closeAllDropdowns(): void {
        this.isBladeDropdownOpen = false;
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
            this.error = 'Veuillez remplir tous les champs et ajouter une photo.';
            this.successMessage = null;
            return;
        }

        this.error = null;
        this.isSubmitting = true;

        this.playerService.createPlayer(this.createPlayerCommand).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.successMessage = 'Joueur créé avec succès !';
                this.resetForm();
            },
            error: () => {
                this.isSubmitting = false;
                this.error = "Une erreur est survenue lors de l'ajout du joueur.";
            },
        });
    }

    private resetForm(): void {
        this.createPlayerCommand = this.getEmptyPlayerCommand();
        this.currentStep = 1;
        this.closeAllDropdowns();
        this.revokePreviewUrl();
        if (this.fileInput) this.fileInput.nativeElement.value = '';
    }

    private revokePreviewUrl(): void {
        if (this.imagePlayerPreviewUrl) {
            URL.revokeObjectURL(this.imagePlayerPreviewUrl);
            this.imagePlayerPreviewUrl = null;
        }
    }
}