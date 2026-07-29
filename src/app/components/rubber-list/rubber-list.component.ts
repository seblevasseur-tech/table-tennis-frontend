import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RubberService } from '../../services/rubber.service';
import { Rubber } from '../../model/rubber';

@Component({
    selector: 'app-rubber-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './rubber-list.component.html',
    styleUrl: './rubber-list.component.scss',
})
export class RubberListComponent implements OnInit {
    rubbers: Rubber[] = [];
    error: string | null = null;
    nameSearchTerm = '';
    brandSearchTerm = '';

    constructor(private rubberService: RubberService) {}
    get filteredRubbers(): Rubber[] {
        const nameQuery = this.nameSearchTerm.trim().toLowerCase();
        const brandQuery = this.brandSearchTerm.trim().toLowerCase();
        return this.rubbers.filter((rubber) => {
            const matchesName = !nameQuery || rubber.name.toLowerCase().includes(nameQuery);
            const matchesBrand = !brandQuery || rubber.brand.toLowerCase().includes(brandQuery);
            return matchesName && matchesBrand;
        });
    }


    ngOnInit(): void {
        this.loadRubbers();
    }

    loadRubbers(): void {
        this.error = null;
        this.rubberService.getAllRubbers().subscribe({
            next: (rubbers) => (this.rubbers = rubbers),
            error: () => (this.error = 'Erreur lors du chargement des revêtements.'),
        });
    }
}