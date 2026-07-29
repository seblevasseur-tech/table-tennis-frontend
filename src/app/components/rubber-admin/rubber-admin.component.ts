import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CreateRubberCommand} from "../../model/rubber";
import {RubberService} from "../../services/rubber.service";

@Component({
    selector: 'app-rubber-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './rubber-admin.component.html',
    styleUrl: './rubber-admin.component.scss',
})
export class RubberAdminComponent {
    createRubberCommand: CreateRubberCommand = this.getEmptyRubberCommand();
    imageRubberPreviewUrl: string | null = null;

    error: string | null = null;
    isSubmitting = false;

    constructor(private rubberService: RubberService) {}

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
            this.createRubberCommand.avatar = file;
            this.imageRubberPreviewUrl = URL.createObjectURL(file);
        }
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
                this.resetForm();
            },
            error: () => {
                this.isSubmitting = false;
                this.error = "Erreur lors de l'ajout du revêtement.";
            },
        });
    }

    private resetForm(): void {
        this.createRubberCommand = this.getEmptyRubberCommand();
        if (this.imageRubberPreviewUrl) {
            URL.revokeObjectURL(this.imageRubberPreviewUrl);
            this.imageRubberPreviewUrl = null;
        }
    }
}