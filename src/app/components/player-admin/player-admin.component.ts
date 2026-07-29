import { Component, ElementRef, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { PlayerService } from '../../services/player.service';
import { CreatePlayerCommand, Player } from '../../model/player';
import { Blade } from '../../model/blade';
import { Rubber } from '../../model/rubber';
import { BladeService } from '../../services/blade.service';
import { RubberService } from '../../services/rubber.service';
import { COUNTRIES, Country, countryFlagUrl } from '../../model/country';

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
    players: Player[] = [];
    editingId: number | null = null;

    // Recherche dans les dropdowns
    bladeSearchQuery = '';
    forehandSearchQuery = '';
    backhandSearchQuery = '';

    error: string | null = null;
    successMessage: string | null = null;
    isSubmitting = false;
    isLoading = true;
    countries = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name, 'fr'));

    isBladeDropdownOpen = false;
    isCountryDropdownOpen = false;
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
                players: this.playerService.getAllPlayers(),
            }).subscribe({
                next: ({ blades, rubbers, players }) => {
                    this.blades = blades;
                    this.rubbers = rubbers;
                    this.players = players;
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
        if (!target.closest('.equipment-dropdown') && !target.closest('.country-dropdown')) {
            this.closeAllDropdowns();
        }
    }

    private getEmptyPlayerCommand(): CreatePlayerCommand {
        return {
            name: '',
            forname: '',
            avatar: null,
            information: '',
            countryCode: null,
            handedness: null,
            bladeId: null,
            forehandRubberId: null,
            backhandRubberId: null,
        };
    }

    getCountryFlagUrl(code: string | null): string {
        return countryFlagUrl(code);
    }

    toggleCountryDropdown(): void {
        this.isCountryDropdownOpen = !this.isCountryDropdownOpen;
        this.closeAllEquipmentDropdowns();
    }

    selectCountry(country: Country): void {
        this.createPlayerCommand.countryCode = country.code;
        this.isCountryDropdownOpen = false;
    }

    private closeAllEquipmentDropdowns(): void {
        this.isBladeDropdownOpen = false;
        this.rubberDropdownOpen = null;
    }

    getCountry(code: string | null): Country | undefined {
        return this.countries.find((country) => country.code === code);
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
        this.isCountryDropdownOpen = false;
        this.closeAllEquipmentDropdowns();
    }

    addPlayer(): void {
        if (
            !this.createPlayerCommand.name ||
            !this.createPlayerCommand.forname ||
            !this.createPlayerCommand.handedness ||
            !this.createPlayerCommand.countryCode ||
            (!this.createPlayerCommand.avatar && !this.editingId) ||
            !this.createPlayerCommand.bladeId ||
            !this.createPlayerCommand.forehandRubberId ||
            !this.createPlayerCommand.backhandRubberId
        ) {
            this.error = this.editingId ? 'Veuillez remplir tous les champs du joueur.' : 'Veuillez remplir tous les champs et ajouter une photo.';
            this.successMessage = null;
            return;
        }

        this.error = null;
        this.isSubmitting = true;

        const request = this.editingId
            ? this.playerService.updatePlayer(this.editingId, this.createPlayerCommand)
            : this.playerService.createPlayer(this.createPlayerCommand);

        request.subscribe({
            next: () => {
                this.isSubmitting = false;
                this.successMessage = this.editingId ? 'Joueur modifie avec succes !' : 'Joueur cree avec succes !';
                this.resetForm();
                this.loadPlayers();
            },
            error: () => {
                this.isSubmitting = false;
                this.error = "Une erreur est survenue lors de l'enregistrement du joueur.";
            },
        });
    }

    private loadPlayers(): void {
        this.playerService.getAllPlayers().subscribe({
            next: (players) => this.players = players,
            error: () => this.error = 'Impossible de charger les joueurs.',
        });
    }

    startEdit(player: Player): void {
        this.editingId = player.id;
        this.createPlayerCommand = {
            name: player.name,
            forname: player.forname,
            avatar: null,
            information: player.information || '',
            countryCode: player.countryCode,
            handedness: player.handedness,
            bladeId: player.blade.id,
            forehandRubberId: player.forehandRubber.id,
            backhandRubberId: player.backhandRubber.id,
        };
        this.imagePlayerPreviewUrl = player.avatar;
        this.error = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    cancelEdit(): void { this.resetForm(); }

    deletePlayer(event: Event, player: Player): void {
        event.stopPropagation();
        if (!confirm('Supprimer le joueur - ' + player.forname + ' ' + player.name + ' ?')) return;
        this.playerService.deletePlayer(player.id).subscribe({
            next: () => {
                if (this.editingId === player.id) this.resetForm();
                this.loadPlayers();
            },
            error: () => this.error = 'Impossible de supprimer ce joueur.',
        });
    }

    private resetForm(): void {
        this.createPlayerCommand = this.getEmptyPlayerCommand();
        this.closeAllDropdowns();
        this.revokePreviewUrl();
        if (this.fileInput) this.fileInput.nativeElement.value = '';
    }

    private revokePreviewUrl(): void {
        if (this.imagePlayerPreviewUrl && this.imagePlayerPreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(this.imagePlayerPreviewUrl);
            this.imagePlayerPreviewUrl = null;
        }
    }
}