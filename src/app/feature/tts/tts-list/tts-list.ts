import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { Sidebar } from '../../../layout/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { TtsService } from '../../../core/services/tts-services/tts-service';
import { Tts } from '../../../core/interfaces/tts';
import { TtsModal } from '../tts-modal/tts-modal';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tts-list',
  imports: [Sidebar, CommonModule, TtsModal, FormsModule, RouterOutlet],
  templateUrl: './tts-list.html',
  styleUrl: './tts-list.scss',
  standalone: true,
})
export class TtsList implements OnInit {
  currentPage = 1;
  pageSize = 9;
  showConfirmModal = false;
  confirmActionType: 'delete' | 'restore' | null = null;
  itemToModify: Tts | null = null;
  @ViewChild('ttsModal') ttsModal!: TtsModal;
  currentAudio: HTMLAudioElement | null = null;
  playingItemId: string | number | null = null;
  audioCurrentTimeStr: string = '0:00';
  audioTotalTimeStr: string = '0:00';
  audioProgressPercent: number = 0;
  selectedItem: Tts | null = null;
  seachTerm: string = '';
  sortAscending: boolean = true;
  ttsHistory: Tts[] = [];

  constructor(
    private ttsService: TtsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTtsHistory();
  }

  loadTtsHistory() {
    this.ttsService.getTts().subscribe((data: Tts[]) => {
      this.ttsHistory = data || [];

      if (this.ttsHistory.length === 0) {
        this.ttsHistory = [
          {
            id: 'fake1',
            text: 'Bienvenido a la demo',
            voice: 'es-ES',
            createdAt: new Date(),
            status: true,
            audioFileId: 'fakeAudioId1',
            showMenu: false,
          },
          {
            id: 'fake2',
            text: 'Hello world',
            voice: 'en-US',
            createdAt: new Date('2026-06-15T09:00:00'),
            status: true,
            audioFileId: 'fakeAudioId2',
            showMenu: false,
          },
          {
            id: 'fake3',
            text: 'Bonjour le monde',
            voice: 'fr-FR',
            createdAt: new Date('2026-06-14T18:30:00'),
            status: false,
            audioFileId: 'fakeAudioId3',
            showMenu: false,
          },
        ];
      }

      this.cdr.detectChanges();
    });
  }

  playAudio(item: Tts) {
    if (this.playingItemId === item.id) {
      this.currentAudio?.pause();
      this.playingItemId = null;
      return;
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    this.audioCurrentTimeStr = '0:00';
    this.audioTotalTimeStr = '0:00';
    this.audioProgressPercent = 0;

    this.ttsService.getAudioBase64(item.id).subscribe({
      next: (base64Data: any) => {
        let base64String =
          typeof base64Data === 'string'
            ? base64Data
            : base64Data.audio || base64Data.data || base64Data.base64 || '';

        if (!base64String) {
          this.playingItemId = null;
          return;
        }

        base64String = base64String.trim();
        let audioUrl = '';
        if (base64String.startsWith('data:audio')) {
          audioUrl = base64String;
        } else {
          audioUrl = `data:audio/mpeg;base64,${base64String}`;
        }

        this.currentAudio = new Audio(audioUrl);
        this.playingItemId = item.id;

        this.currentAudio.addEventListener('loadedmetadata', () => {
          this.audioTotalTimeStr = this.formatTime(this.currentAudio!.duration);
          this.cdr.detectChanges();
        });

        this.currentAudio.addEventListener('timeupdate', () => {
          if (this.currentAudio && this.currentAudio.duration) {
            this.audioCurrentTimeStr = this.formatTime(
              this.currentAudio.currentTime,
            );
            this.audioProgressPercent =
              (this.currentAudio.currentTime / this.currentAudio.duration) *
              100;
            this.cdr.detectChanges();
          }
        });

        this.currentAudio.play().catch((err: any) => {
          console.error('Error al intentar reproducir:', err);
          this.playingItemId = null;
          this.cdr.detectChanges();
        });

        this.currentAudio.onended = () => {
          this.playingItemId = null;
          this.audioProgressPercent = 0;
          this.cdr.detectChanges();
        };

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al obtener el audio del servicio:', err);
        this.playingItemId = null;
        this.cdr.detectChanges();
      },
    });
  }

  formatTime(timeInSeconds: number): string {
    if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  seekAudio(event: MouseEvent) {
    if (!this.currentAudio || !this.currentAudio.duration) return;
    const progressBar = event.currentTarget as HTMLElement;
    const clickPosition = event.offsetX;
    const totalWidth = progressBar.clientWidth;
    const percentage = clickPosition / totalWidth;
    this.currentAudio.currentTime = percentage * this.currentAudio.duration;
  }

  ngOnDestroy() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }

  openNewTts() {
    this.ttsModal.open();
  }

  onModalClosed() {
    this.loadTtsHistory();
  }

  @HostListener('document:click', ['$event'])
  cerrarMenusAlClicarAfuera(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (targetElement && targetElement.closest('.menu-popup')) return;

    this.ttsHistory.forEach((t) => {
      if (t.showMenu) t.showMenu = false;
    });
  }

  get filteredAndSortedTts() {
    let result = [...(this.ttsHistory || [])];

    if (this.seachTerm.trim()) {
      const term = this.seachTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.text?.toLowerCase().includes(term) ||
          t.voice?.toLowerCase().includes(term),
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return this.sortAscending ? dateA - dateB : dateB - dateA;
    });

    return result;
  }

  get paginatedTts(): Tts[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredAndSortedTts.slice(start, end);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.filteredAndSortedTts.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  toggleSort() {
    this.sortAscending = !this.sortAscending;
    this.currentPage = 1;
  }

  openMenu(item: Tts, event: MouseEvent) {
    if (item.showMenu) {
      item.showMenu = false;
      return;
    }

    this.ttsHistory.forEach((t) => (t.showMenu = false));
    event.stopPropagation();
    item.showMenu = true;

    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    item.menuLeft = rect.left - 130;

    if (rect.bottom > viewportHeight - 160) {
      item.MenuTop = rect.top - 140;
    } else {
      item.MenuTop = rect.bottom + 5;
    }
  }

  editItem(item: Tts) {
    this.ttsHistory.forEach((t) => (t.showMenu = false));
    this.ttsModal.open(item);
  }

  onModalSaved() {
    console.log('Cambios guardados, recargando historial...');
    this.loadTtsHistory();
  }

  confirmDelete(item: Tts) {
    item.showMenu = false;
    this.itemToModify = item;
    this.confirmActionType = 'delete';
    this.showConfirmModal = true;
  }

  confirmRestore(item: Tts) {
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
      this.ttsService.deleteTts(this.itemToModify.id).subscribe({
        next: () => {
          this.itemToModify!.status = false;
          this.closeConfirmModal();
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err),
      });
    } else if (this.confirmActionType === 'restore') {
      this.ttsService.restoreTts(this.itemToModify.id).subscribe({
        next: () => {
          this.itemToModify!.status = true;
          this.closeConfirmModal();
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err),
      });
    }
  }
}
