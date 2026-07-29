import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateBladeCommand, Blade } from '../../model/blade';
import { BladeService } from '../../services/blade.service';

@Component({
    selector: 'app-blade-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './blade-admin.component.html',
    styleUrl: './blade-admin.component.scss',
})
export class BladeAdminComponent implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
    createBladeCommand: CreateBladeCommand = this.getEmptyBladeCommand();
    blades: Blade[] = [];
    imageBladePreviewUrl: string | null = null;
    editingId: number | null = null;
    error: string | null = null;
    isSubmitting = false;

    constructor(private bladeService: BladeService) {}

    ngOnInit(): void { this.loadBlades(); }

    private loadBlades(): void {
        this.bladeService.getAllBlades().subscribe({
            next: (blades) => this.blades = blades,
            error: () => this.error = 'Impossible de charger les bois.',
        });
    }

    private getEmptyBladeCommand(): CreateBladeCommand {
        return { brand: '', name: '', avatar: null, information: '' };
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
            this.createBladeCommand.avatar = file;
            this.imageBladePreviewUrl = URL.createObjectURL(file);
        }
    }

    addBlade(): void {
        if (!this.createBladeCommand.brand || !this.createBladeCommand.name || (!this.createBladeCommand.avatar && !this.editingId)) {
            this.error = 'La marque, le nom et la photo sont requis.';
            return;
        }
        this.error = null;
        this.isSubmitting = true;
        const request = this.editingId
            ? this.bladeService.updateBlade(this.editingId, this.createBladeCommand)
            : this.bladeService.createBlade(this.createBladeCommand);
        request.subscribe({
            next: () => {
                this.isSubmitting = false;
                this.resetForm();
                this.loadBlades();
            },
            error: () => {
                this.isSubmitting = false;
                this.error = "Erreur lors de l'enregistrement du bois.";
            },
        });
    }

    startEdit(blade: Blade): void {
        this.editingId = blade.id;
        this.createBladeCommand = {
            brand: blade.brand,
            name: blade.name,
            avatar: null,
            information: blade.information || '',
        };
        this.imageBladePreviewUrl = blade.avatar;
        this.error = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    cancelEdit(): void { this.resetForm(); }

    deleteBlade(event: Event, blade: Blade): void {
        event.stopPropagation();
        if (!confirm('Supprimer le bois - ' + blade.brand + ' ' + blade.name + ' ?')) return;
        this.bladeService.deleteBlade(blade.id).subscribe({
            next: () => {
                if (this.editingId === blade.id) this.resetForm();
                this.loadBlades();
            },
            error: () => this.error = 'Impossible de supprimer ce bois. Il est peut-etre utilise par un joueur.',
        });
    }

    private resetForm(): void {
        this.createBladeCommand = this.getEmptyBladeCommand();
        this.editingId = null;
        this.revokePreviewUrl();
        if (this.fileInput) this.fileInput.nativeElement.value = '';
    }

    private revokePreviewUrl(): void {
        if (this.imageBladePreviewUrl && this.imageBladePreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(this.imageBladePreviewUrl);
        }
        this.imageBladePreviewUrl = null;
    }
}
