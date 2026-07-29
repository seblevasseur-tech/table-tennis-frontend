import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Rubber } from '../../model/rubber';
import { RubberService } from '../../services/rubber.service';

@Component({
    selector: 'app-rubber-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './rubber-detail.component.html',
    styleUrl: './rubber-detail.component.scss',
})
export class RubberDetailComponent implements OnInit {
    item: Rubber | null = null;
    isLoading = true;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private service: RubberService,
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) {
            this.error = 'Revêtement introuvable.';
            this.isLoading = false;
            return;
        }

        this.service.getRubberById(id).subscribe({
            next: (item) => { this.item = item; this.isLoading = false; },
            error: () => {
                this.error = 'Impossible de charger les informations du revêtement.';
                this.isLoading = false;
            },
        });
    }
}
