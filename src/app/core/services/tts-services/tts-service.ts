import { Injectable } from '@angular/core';
import { Tts } from '../../interfaces/tts';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TtsService {
  private apiUrl = 'http://localhost:8085/api/tts';

  constructor(private http: HttpClient) {}

  getTts(): Observable<Tts[]> {
    return this.http.get<Tts[]>(`${this.apiUrl}/history`).pipe(
      catchError(err => {
        console.error('Backend no disponible (getTts)', err);
        return of([]); 
      })
    );
  }

  deleteTts(id: string) {
    return this.http.patch(`${this.apiUrl}/delete/${id}`, {}).pipe(
      catchError(err => {
        console.error('Backend no disponible (deleteTts)', err);
        return of(null);
      })
    );
  }

  restoreTts(id: string) {
    return this.http.patch(`${this.apiUrl}/restore/${id}`, {}).pipe(
      catchError(err => {
        console.error('Backend no disponible (restoreTts)', err);
        return of(null);
      })
    );
  }

  createTts(data: { voice: string; text: string }): Observable<Tts> {
    return this.http.post<Tts>(`${this.apiUrl}/generate`, data).pipe(
      catchError(err => {
        console.error('Backend no disponible (createTts)', err);
        return of({} as Tts); 
      })
    );
  }

  updateTts(id: string, payload: any): Observable<Tts> {
    return this.http.put<Tts>(`${this.apiUrl}/update/${id}`, payload).pipe(
      catchError(err => {
        console.error('Backend no disponible (updateTts)', err);
        return of({} as Tts);
      })
    );
  }

  getAudioBase64(id: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/audio/frontend/${id}`, {
      responseType: 'text',
    }).pipe(
      catchError(err => {
        console.error('Backend no disponible (getAudioBase64)', err);
        return of('');
      })
    );
  }
}
