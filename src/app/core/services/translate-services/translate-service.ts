import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Translate } from '../../interfaces/translate';
import { TranslateResponse } from '../../interfaces/translate-response';
import { TranslateRequest } from '../../interfaces/translate-request';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private apiUrl = 'http://localhost:8085/api/translate';

  constructor(private http: HttpClient) {}

  getTranslations(): Observable<Translate[]> {
    return this.http.get<Translate[]>(`${this.apiUrl}/history`);
  }

  getLanguages(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/languages`);
  }

  detectLanguage(text: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/detect`, { text });
  }

  createTranslation(payload: { text: string; sourceLang: string; targetLang: string }): Observable<TranslateResponse> {
    return this.http.post<TranslateResponse>(this.apiUrl, payload);
  }

  deleteTranslation(id: string){
    return this.http.patch(`${this.apiUrl}/delete/${id}`, {});
  }

  restoreTranslation(id: string){
    return this.http.patch(`${this.apiUrl}/restore/${id}`, {});
  }

  translatePreview(payload: TranslateRequest): Observable<TranslateResponse> {
    return this.http.post <TranslateResponse>(`${this.apiUrl}/preview`, payload);
  }

  updateTranslation(id: string, payload: any): Observable<any> {
    return this.http.put<TranslateResponse>(`${this.apiUrl}/update/${id}`, payload);
  }
}
