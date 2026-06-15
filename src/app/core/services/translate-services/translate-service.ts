import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Translate } from '../../interfaces/translate';
import { TranslateResponse } from '../../interfaces/translate-response';
import { TranslateRequest } from '../../interfaces/translate-request';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private apiUrl = 'http://localhost:8085/api/translate';

  constructor(private http: HttpClient) {}

  getTranslations(): Observable<Translate[]> {
    return this.http.get<Translate[]>(`${this.apiUrl}/history`).pipe(
      catchError(() => of([]))
    );
  }

  getLanguages(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/languages`).pipe(
      catchError(() => of([]))
    );
  }

  detectLanguage(text: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/detect`, { text }).pipe(
      catchError(() => of({ detectedLang: 'unknown' }))
    );
  }

  createTranslation(payload: { text: string; sourceLang: string; targetLang: string }): Observable<TranslateResponse> {
    return this.http.post<TranslateResponse>(this.apiUrl, payload).pipe(
      catchError(() => of({} as TranslateResponse))
    );
  }

  deleteTranslation(id: string) {
    return this.http.patch(`${this.apiUrl}/delete/${id}`, {}).pipe(
      catchError(() => of(null))
    );
  }

  restoreTranslation(id: string) {
    return this.http.patch(`${this.apiUrl}/restore/${id}`, {}).pipe(
      catchError(() => of(null))
    );
  }

  translatePreview(payload: TranslateRequest): Observable<TranslateResponse> {
    return this.http.post<TranslateResponse>(`${this.apiUrl}/preview`, payload).pipe(
      catchError(() => of({} as TranslateResponse))
    );
  }

  updateTranslation(id: string, payload: any): Observable<any> {
    return this.http.put<TranslateResponse>(`${this.apiUrl}/update/${id}`, payload).pipe(
      catchError(() => of({} as TranslateResponse))
    );
  }
}
