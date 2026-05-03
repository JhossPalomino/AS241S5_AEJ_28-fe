import { Injectable } from '@angular/core';
import { Tts } from '../../interfaces/tts';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TtsService {
  private apiUrl = 'http://localhost:8085/api/tts';

  constructor(private http: HttpClient) {}

  getTts(): Observable<Tts[]> {
    return this.http.get<Tts[]>(`${this.apiUrl}/history`);
  }

  deleteTts(id: string) {
    return this.http.patch(`${this.apiUrl}/delete/${id}`, {});
  }

  restoreTts(id: string) {
    return this.http.patch(`${this.apiUrl}/restore/${id}`, {});
  }

  createTts(data: { voice: string; text: string }): Observable<Tts> {
    return this.http.post<Tts>(`${this.apiUrl}/generate`, data);
  }

  updateTts(id: string, payload: any): Observable<Tts> {
    return this.http.put<Tts>(`${this.apiUrl}/update/${id}`, payload);
  }

  getAudioBase64(id: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/audio/frontend/${id}`, {
      responseType: 'text', // <--- Esto evita que Angular falle si no recibe un JSON
    });
  }
}
