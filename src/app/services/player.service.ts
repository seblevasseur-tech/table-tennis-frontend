import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {CreatePlayerCommand, Player} from "../model/player";

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
    const formData = new FormData();
    formData.append('name', command.name);
    formData.append('forname', command.forname);
    formData.append('handedness', command.handedness!);
    formData.append('bladeId', command.bladeId!.toString());
    formData.append('forehandRubberId', command.forehandRubberId!.toString());
    formData.append('backhandRubberId', command.backhandRubberId!.toString());
    formData.append('information', command.information);
    formData.append('avatar', command.avatar!, command.avatar!.name);

    return this.http.post<Player>(this.apiUrl, formData);
  }

  updatePlayer(id: number, player: Player): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/${id}`, player);
  }

  deletePlayer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
