import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {CreateRubberCommand, Rubber} from "../model/rubber";

@Injectable({
    providedIn: 'root',
})
export class RubberService {
    private readonly apiUrl = `${environment.backendUrl}/api/rubbers`;

    constructor(private http: HttpClient) {}

    getAllRubbers(): Observable<Rubber[]> {
        return this.http.get<Rubber[]>(this.apiUrl);
    }

    getRubberById(id: number): Observable<Rubber> {
        return this.http.get<Rubber>(`${this.apiUrl}/${id}`);
    }

    createRubber(command: CreateRubberCommand): Observable<Rubber> {
        const formData = new FormData();
        formData.append('name', command.name);
        formData.append('brand', command.brand);
        formData.append('avatar', command.avatar, command.avatar.name);

        console.log(formData);
        return this.http.post<Rubber>(this.apiUrl, formData);
    }

    updateRubber(id: number, rubber: Rubber): Observable<Rubber> {
        return this.http.put<Rubber>(`${this.apiUrl}/${id}`, rubber);
    }

    deleteRubber(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
