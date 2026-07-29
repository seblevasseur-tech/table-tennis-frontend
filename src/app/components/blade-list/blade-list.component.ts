import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BladeService } from '../../services/blade.service';
import {Blade} from "../../model/blade";

@Component({
    selector: 'app-blade-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './blade-list.component.html',
    styleUrl: './blade-list.component.scss',
})
export class BladeListComponent implements OnInit {
    blades: Blade[] = [];
    error: string | null = null;

    constructor(private bladeService: BladeService) {}

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