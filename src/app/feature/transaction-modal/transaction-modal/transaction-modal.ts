import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-modal',
  imports: [CommonModule],
  templateUrl: './transaction-modal.html',
  styleUrl: './transaction-modal.scss',
})
export class TransactionModal {
    isOpen = false;

  @Output() closed = new EventEmitter<void>();

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.closed.emit();
  }
}
