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
    nameSearchTerm = '';
    brandSearchTerm = '';

    constructor(private bladeService: BladeService) {}
    get filteredBlades(): Blade[] {
        const nameQuery = this.nameSearchTerm.trim().toLowerCase();
        const brandQuery = this.brandSearchTerm.trim().toLowerCase();
        return this.blades.filter((blade) => {
            const matchesName = !nameQuery || blade.name.toLowerCase().includes(nameQuery);
            const matchesBrand = !brandQuery || blade.brand.toLowerCase().includes(brandQuery);
            return matchesName && matchesBrand;
        });
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