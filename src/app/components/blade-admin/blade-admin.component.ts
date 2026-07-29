import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

    constructor(
        private bladeService: BladeService,
        private router: Router
    ) {}


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

        console.log("addBlade");
        console.log(this.createBladeCommand);
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
}