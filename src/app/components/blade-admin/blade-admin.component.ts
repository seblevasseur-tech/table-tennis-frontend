import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CreateBladeCommand} from "../../model/blade";
import {BladeService} from "../../services/blade.service";

@Component({
    selector: 'app-blade-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './blade-admin.component.html',
    styleUrl: './blade-admin.component.scss',
})
export class BladeAdminComponent {
    createBladeCommand: CreateBladeCommand = this.getEmptyBladeCommand();
    imageBladePreviewUrl: string | null = null;

    error: string | null = null;
    isSubmitting = false;

    constructor(private bladeService: BladeService) {}


    private getEmptyBladeCommand(): CreateBladeCommand {
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
            this.createBladeCommand.avatar = file;
            this.imageBladePreviewUrl = URL.createObjectURL(file);
        }
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
                this.resetForm(); // <--- Remet le formulaire à zéro
            },
            error: () => {
                this.isSubmitting = false;
                this.error = "Erreur lors de l'ajout du bois.";
            },
        });
    }

    private resetForm(): void {
        this.createBladeCommand = this.getEmptyBladeCommand();
        if (this.imageBladePreviewUrl) {
            URL.revokeObjectURL(this.imageBladePreviewUrl);
            this.imageBladePreviewUrl = null;
        }
    }
}