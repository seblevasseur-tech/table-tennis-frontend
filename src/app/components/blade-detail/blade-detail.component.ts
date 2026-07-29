import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Blade } from '../../model/blade';
import { BladeService } from '../../services/blade.service';

@Component({
    selector: 'app-blade-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './blade-detail.component.html',
    styleUrl: './blade-detail.component.scss',
})
export class BladeDetailComponent implements OnInit {
    item: Blade | null = null;
    isLoading = true;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private service: BladeService,
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) {
            this.error = 'Bois introuvable.';
            this.isLoading = false;
            return;
        }

        this.service.getBladeById(id).subscribe({
            next: (item) => { this.item = item; this.isLoading = false; },
            error: () => {
                this.error = 'Impossible de charger les informations du bois.';
                this.isLoading = false;
            },
        });
    }
}
