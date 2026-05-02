import { Component } from '@angular/core';
import { Sidebar } from "../../../layout/sidebar/sidebar";
import { TransactionModal } from "../../transaction-modal/transaction-modal/transaction-modal";

@Component({
  selector: 'app-translate-list',
  imports: [Sidebar, TransactionModal],
  templateUrl: './translate-list.html',
  styleUrl: './translate-list.scss',
})
export class TranslateList {

}
