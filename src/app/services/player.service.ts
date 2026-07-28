import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Player {
  id: number;
  name: string;
  forname: string;
  rating: number;
  avatar: File;
}

export interface CreatePlayerCommand {
  name: string;
  forname: string;
  rating: number;
  avatar: File;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private readonly apiUrl = `${environment.backendUrl}/api/players`;

  constructor(private http: HttpClient) {}

  getAllPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }

  getPlayerById(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/${id}`);
  }

  createPlayer(command: CreatePlayerCommand): Observable<Player> {
    return this.http.post<Player>(this.apiUrl, command);
  }

  updatePlayer(id: number, player: Player): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/${id}`, player);
  }

  deletePlayer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
