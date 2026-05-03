import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { Sidebar } from '../../../layout/sidebar/sidebar';
import { TransactionModal } from '../../transaction-modal/transaction-modal/transaction-modal';
import { TranslateService } from '../../../core/services/translate-services/translate-service';
import { CommonModule } from '@angular/common';
import { Translate } from '../../../core/interfaces/translate';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from "@angular/router"; 

@Component({
  selector: 'app-translate-list',
  imports: [Sidebar, TransactionModal, CommonModule, FormsModule, RouterOutlet],
  templateUrl: './translate-list.html',
  styleUrl: './translate-list.scss',
  standalone: true,
})
export class TranslateList implements OnInit {
  translations: Translate[] = [];
  languageMap: { [key: string]: string } = {};
  currentPage = 1;
  pageSize = 12;
  showConfirmModal = false;
  confirmActionType: 'delete' | 'restore' | null = null;
  itemToModify: Translate | null = null;
  sortAscending = true;
  searchTerm: string = '';
  @ViewChild('transactionModal') transactionModal!: TransactionModal;

  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadLanguages();
    this.loadTranslations();
  }

  loadLanguages() {
    this.translateService.getLanguages().subscribe((res: any) => {
      res.languages.forEach((l: { language: string; name: string }) => {
        this.languageMap[l.language] = l.name;
      });
      this.cdr.detectChanges();
    });
  }

  getLanguageName(code: string): string {
    return this.languageMap[code] || code;
  }

  loadTranslations() {
    this.translateService.getTranslations().subscribe((data: Translate[]) => {
      this.translations = data;
      this.cdr.detectChanges();
    });
  }

  onModalClosed() {
    this.loadTranslations();
  }

  @HostListener('document:click', ['$event'])
  cerrarMenusAlClicarAfuera(event: Event) {
    const targetElement = event.target as HTMLElement;

    if (targetElement && targetElement.closest('.menu-popup')) {
      return;
    }

    this.translations.forEach((t) => {
      if (t.showMenu) {
        t.showMenu = false;
      }
    });
  }

  get paginatedTranslations(): Translate[] {
    const filtered = this.filteredTranslations;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return filtered.slice(start, end);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.translations.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  openMenu(item: any, event: MouseEvent) {
    if (item.showMenu) {
      item.showMenu = false;
      return;
    }

    this.translations.forEach((t) => (t.showMenu = false));
    event.stopPropagation();
    item.showMenu = true;

    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    item.menuLeft = rect.left - 130;

    if (rect.bottom > viewportHeight - 160) {
      item.menuTop = rect.top - 140;
    } else {
      item.menuTop = rect.bottom + 5;
    }
  }

  toggleSort() {
    this.sortAscending = !this.sortAscending;
    this.translations.sort((a, b) => {
      const textA = a.originalText.toLowerCase();
      const textB = b.originalText.toLowerCase();
      return this.sortAscending
        ? textA.localeCompare(textB)
        : textB.localeCompare(textA);
    });
  }

  toggleMenu(item: any) {
    item.showMenu = !item.showMenu;
  }

  edit(t: any) {
    t.showMenu = false;
    this.transactionModal.open(t);
  }

  confirmDelete(item: Translate) {
    item.showMenu = false;
    this.itemToModify = item;
    this.confirmActionType = 'delete';
    this.showConfirmModal = true;
  }

  confirmRestore(item: Translate) {
    item.showMenu = false;
    this.itemToModify = item;
    this.confirmActionType = 'restore';
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.itemToModify = null;
    this.confirmActionType = null;
  }

  executeConfirmAction() {
    if (!this.itemToModify || !this.confirmActionType) return;

    if (this.confirmActionType === 'delete') {
      this.translateService.deleteTranslation(this.itemToModify.id).subscribe({
        next: () => {
          this.itemToModify!.status = false;
          this.closeConfirmModal();
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err),
      });
    } else if (this.confirmActionType === 'restore') {
      this.translateService.restoreTranslation(this.itemToModify.id).subscribe({
        next: () => {
          this.itemToModify!.status = true;
          this.closeConfirmModal();
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err),
      });
    }
  }
  /*
  delete(item: Translate) {
    item.showMenu = false;

    this.translateService.deleteTranslation(item.id).subscribe({
      next: () => {
        item.status = false;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  restore(item: Translate) {
    item.showMenu = false;

    this.translateService.restoreTranslation(item.id).subscribe({
      next: () => {
        item.status = true;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }*/

  view(item: any) {
    console.log(item);
  }

  get filteredTranslations(): Translate[] {
    const term = this.searchTerm.toLowerCase();
    return this.translations.filter(
      (t) =>
        t.originalText.toLowerCase().includes(term) ||
        t.translatedText.toLowerCase().includes(term),
    );
  }
}
