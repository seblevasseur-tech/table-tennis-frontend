import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RubberService } from '../../services/rubber.service';
import {Rubber} from "../../model/rubber";

@Component({
    selector: 'app-rubber-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './rubber-list.component.html',
    styleUrl: './rubber-list.component.scss',
})
export class RubberListComponent implements OnInit {
    rubbers: Rubber[] = [];
    error: string | null = null;

    constructor(private rubberService: RubberService) {}

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