import { Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../../core/services/translate-services/translate-service';
import { FormsModule } from '@angular/forms';
import { TranslateResponse } from '../../../core/interfaces/translate-response';
import { TranslateRequest } from '../../../core/interfaces/translate-request';

@Component({
  selector: 'app-transaction-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-modal.html',
  styleUrl: './transaction-modal.scss',
})
export class TransactionModal {
  isOpen = false;
  languages: { language: string; name: string }[] = [];
  sourceLanguage = 'detect';
  targetLanguage = 'en';
  text = '';
  translatedText = '';
  canTranslate = false;
  lastOriginalText = '';
  sourceDropdownOpen = false;
  targetDropdownOpen = false;
  sourceSearchText = 'detectar';
  targetSearchText = '';
  filteredSourceLangs: { language: string; name: string }[] = [];
  filteredTargetLangs: { language: string; name: string }[] = [];
  currentCreatedAt: string = '';
  currentStatus: boolean = true;
  isEditMode: boolean = false;
  currentEditId: string | null = null;

  @Output() closed = new EventEmitter<void>();

  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.translateService.getLanguages().subscribe((res) => {
      this.languages = res.languages;
      this.filteredSourceLangs = [...this.languages];
      this.filteredTargetLangs = [...this.languages];
      const defaultTarget = this.languages.find(
        (l) => l.language === this.targetLanguage,
      );
      if (defaultTarget) this.targetSearchText = defaultTarget.name;
      this.cdr.detectChanges();
    });
  }

  open(item?: any) {
    this.isOpen = true;

    if (item) {
      this.isEditMode = true;
      this.currentEditId = item.id;
      this.text = item.originalText;
      this.translatedText = item.translatedText;
      this.lastOriginalText = item.originalText;
      this.currentCreatedAt = item.createdAt;
      this.currentStatus = item.status;
      this.canTranslate = this.text.trim().length > 0;

      const sLang = this.languages?.find(
        (l: any) => l.language === item.sourceLanguage,
      );
      this.sourceLanguage = item.sourceLanguage;
      this.sourceSearchText = sLang ? sLang.name : item.sourceLanguage;

      const tLang = this.languages?.find(
        (l: any) => l.language === item.targetLanguage,
      );
      this.targetLanguage = item.targetLanguage;
      this.targetSearchText = tLang ? tLang.name : item.targetLanguage;
    } else {
      this.isEditMode = false;
      this.currentEditId = null;
      this.text = '';
      this.translatedText = '';
      this.lastOriginalText = '';
      this.sourceSearchText = 'detectar';
      this.sourceLanguage = 'detect';
      this.targetLanguage = 'en';
      this.targetSearchText = 'english';
      this.canTranslate = false;
    }
    this.cdr.detectChanges();
  }

  close() {
    this.isOpen = false;
    this.closed.emit();
    this.cdr.detectChanges();
  }

  executeAction() {
    if (this.isEditMode) {
      this.editAndPreview(this.sourceLanguage || 'detect');
    } else {
      this.translateAndSave();
    }
  }

  translateAndSave() {
    if (this.sourceLanguage === 'detect') {
      this.translateService.detectLanguage(this.text).subscribe((res) => {
        this.sendTranslation(res.detectedLang);
      });
    } else {
      this.sendTranslation(this.sourceLanguage);
    }
  }

  sendTranslation(sourceLang: string) {
    const payload = {
      text: this.text,
      sourceLang: sourceLang,
      targetLang: this.targetLanguage,
    };

    this.translateService.createTranslation(payload).subscribe({
      next: (res: TranslateResponse) => {
        this.translatedText = res.translatedText;
        this.lastOriginalText = res.originalText;
        this.canTranslate = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  editAndPreview(sourceLang: string) {
    if (sourceLang === 'detect') {
      this.translateService.detectLanguage(this.text).subscribe((res) => {
        this.sendPreviewRequest(res.detectedLang);
      });
    } else {
      this.sendPreviewRequest(this.sourceLanguage);
    }
  }

  sendPreviewRequest(sourceLang: string) {
    const payload: TranslateRequest = {
      text: this.text,
      sourceLang: sourceLang,
      targetLang: this.targetLanguage,
    };

    this.translateService.translatePreview(payload).subscribe({
      next: (res: TranslateResponse) => {
        this.translatedText = res.translatedText;
        this.lastOriginalText = res.originalText;
        this.cdr.detectChanges();

        const updatePayload = {
          sourceLanguage: res.sourceLang,
          targetLanguage: res.targetLang,
          originalText: res.originalText,
          translatedText: res.translatedText,
          createdAt: this.currentCreatedAt,
          status: this.currentStatus,
        };

        if (this.currentEditId) {
          this.translateService
            .updateTranslation(this.currentEditId, updatePayload)
            .subscribe({
              next: () => {
                this.canTranslate = false;
                this.cdr.detectChanges();
              },
              error: (err) => console.error(err),
            });
        }
      },
      error: (err) => console.error(err),
    });
  }

  onTextChange() {
    this.canTranslate = this.text.trim().length > 0;
  }

  filterSource() {
    const search = this.sourceSearchText.toLowerCase();
    this.filteredSourceLangs = this.languages.filter((l) =>
      l.name.toLowerCase().includes(search),
    );
  }

  filterTarget() {
    const search = this.targetSearchText.toLowerCase();
    this.filteredTargetLangs = this.languages.filter((l) =>
      l.name.toLowerCase().includes(search),
    );
  }

  selectLanguage(code: string, name: string, type: 'source' | 'target') {
    if (type === 'source') {
      this.sourceLanguage = code;
      this.sourceSearchText = name;
      this.sourceDropdownOpen = false;
    } else {
      this.targetLanguage = code;
      this.targetSearchText = name;
      this.targetDropdownOpen = false;
    }
    this.canTranslate = this.text.trim().length > 0;
  }

  closeDropdown(type: 'source' | 'target') {
    setTimeout(() => {
      if (type === 'source') {
        this.sourceDropdownOpen = false;
        if (this.sourceLanguage === 'detect') {
          this.sourceSearchText = 'detectar';
        } else {
          const lang = this.languages.find(
            (l) => l.language === this.sourceLanguage,
          );
          if (lang) this.sourceSearchText = lang.name;
        }
        this.filteredSourceLangs = [...this.languages];
      } else {
        this.targetDropdownOpen = false;
        const lang = this.languages.find(
          (l) => l.language === this.targetLanguage,
        );
        if (lang) this.targetSearchText = lang.name;
        this.filteredTargetLangs = [...this.languages];
      }
      this.cdr.detectChanges();
    }, 200);
  }
}