import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BladeService } from '../../services/blade.service';
import { Blade } from '../../model/blade';

@Component({
    selector: 'app-blade-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './blade-list.component.html',
    styleUrl: './blade-list.component.scss',
})
export class BladeListComponent implements OnInit {
    blades: Blade[] = [];
    error: string | null = null;
    searchTerm = '';

    constructor(private bladeService: BladeService) {}
    get filteredBlades(): Blade[] {
        const query = this.searchTerm.trim().toLowerCase();
        if (!query) return this.blades;
        return this.blades.filter((blade) =>
            (blade.brand + ' ' + blade.name).toLowerCase().includes(query)
        );
    }



    ngOnInit(): void {
        this.loadBlades();
    }

    loadBlades(): void {
        this.error = null;
        this.bladeService.getAllBlades().subscribe({
            next: (blades) => (this.blades = blades),
            error: () => (this.error = 'Erreur lors du chargement des bois.'),
        });
    }
}