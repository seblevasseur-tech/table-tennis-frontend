import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CreateBladeCommand, Blade } from "../model/blade";

@Injectable({
    providedIn: 'root',
})
export class BladeService {
    private readonly apiUrl = `${environment.backendUrl}/api/blades`;

    constructor(private http: HttpClient) {}

    getAllBlades(): Observable<Blade[]> {
        return this.http.get<Blade[]>(this.apiUrl);
    }

    getBladeById(id: number): Observable<Blade> {
        return this.http.get<Blade>(`${this.apiUrl}/${id}`);
    }

    createBlade(command: CreateBladeCommand): Observable<Blade> {
        const formData = new FormData();
        formData.append('name', command.name);
        formData.append('brand', command.brand);
        formData.append('avatar', command.avatar, command.avatar.name);

        console.log(formData);
        return this.http.post<Blade>(this.apiUrl, formData);
    }

    updateBlade(id: number, blade: Blade): Observable<Blade> {
        return this.http.put<Blade>(`${this.apiUrl}/${id}`, blade);
    }

    deleteBlade(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
