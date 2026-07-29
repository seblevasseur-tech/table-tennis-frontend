import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateRubberCommand, Rubber } from '../../model/rubber';
import { RubberService } from '../../services/rubber.service';

@Component({
    selector: 'app-rubber-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './rubber-admin.component.html',
    styleUrl: './rubber-admin.component.scss',
})
export class RubberAdminComponent implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
    createRubberCommand: CreateRubberCommand = this.getEmptyRubberCommand();
    rubbers: Rubber[] = [];
    imageRubberPreviewUrl: string | null = null;
    editingId: number | null = null;
    error: string | null = null;
    isSubmitting = false;

    constructor(private rubberService: RubberService) {}

    ngOnInit(): void { this.loadRubbers(); }

    private loadRubbers(): void {
        this.rubberService.getAllRubbers().subscribe({
            next: (rubbers) => this.rubbers = rubbers,
            error: () => this.error = 'Impossible de charger les revetement.',
        });
    }

    private getEmptyRubberCommand(): CreateRubberCommand {
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
            this.createRubberCommand.avatar = file;
            this.imageRubberPreviewUrl = URL.createObjectURL(file);
        }
    }

    addRubber(): void {
        if (!this.createRubberCommand.brand || !this.createRubberCommand.name || (!this.createRubberCommand.avatar && !this.editingId)) {
            this.error = 'La marque, le nom et la photo est requise.';
            return;
        }
        this.error = null;
        this.isSubmitting = true;
        const request = this.editingId
            ? this.rubberService.updateRubber(this.editingId, this.createRubberCommand)
            : this.rubberService.createRubber(this.createRubberCommand);
        request.subscribe({
            next: () => {
                this.isSubmitting = false;
                this.resetForm();
                this.loadRubbers();
            },
            error: () => {
                this.isSubmitting = false;
                this.error = "Erreur lors de l'enregistrement du revetement.";
            },
        });
    }

    startEdit(rubber: Rubber): void {
        this.editingId = rubber.id;
        this.createRubberCommand = {
            brand: rubber.brand,
            name: rubber.name,
            avatar: null,
            information: rubber.information || '',
        };
        this.imageRubberPreviewUrl = rubber.avatar;
        this.error = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    cancelEdit(): void { this.resetForm(); }

    deleteRubber(event: Event, rubber: Rubber): void {
        event.stopPropagation();
        if (!confirm('Supprimer le revetement - ' + rubber.brand + ' ' + rubber.name + ' ?')) return;
        this.rubberService.deleteRubber(rubber.id).subscribe({
            next: () => {
                if (this.editingId === rubber.id) this.resetForm();
                this.loadRubbers();
            },
            error: () => this.error = 'Impossible de supprimer ce revetement. Il est peut-etre utilise par un joueur.',
        });
    }

    private resetForm(): void {
        this.createRubberCommand = this.getEmptyRubberCommand();
        this.editingId = null;
        this.revokePreviewUrl();
        if (this.fileInput) this.fileInput.nativeElement.value = '';
    }

    private revokePreviewUrl(): void {
        if (this.imageRubberPreviewUrl && this.imageRubberPreviewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(this.imageRubberPreviewUrl);
        }
        this.imageRubberPreviewUrl = null;
    }
}
