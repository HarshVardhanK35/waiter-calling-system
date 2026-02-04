import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { debounceTime, Subject } from 'rxjs';

import { CardsComponent } from "../shared/cards/cards.component";

import { TableSelectionService } from '../../services/table-selection.service';
import { TableCallService } from '../../services/table-call.service';

import { Table } from '../../models/table.model';

@Component({
  standalone: true,
  selector: 'app-table-details',
  imports: [CardsComponent, AsyncPipe],
  templateUrl: './table-details.component.html',
  styleUrl: './table-details.component.css',
})
export class TableDetails implements OnInit {
  private tableSelectionService = inject(TableSelectionService);
  private tableCallService = inject(TableCallService);

  selectedTable$ = this.tableSelectionService.selectedTable$;

  private callClick$ = new Subject<Table>();

  constructor() {
    this.callClick$
      .pipe(debounceTime(1000))
      .subscribe(table => {
        this.tableCallService.callWaiter(table);
      });
  }

  ngOnInit() {
    const rawId = window.location.pathname.split('/').pop();
    if (rawId) {
      const tableId = `T${rawId}`;
      this.tableSelectionService.selectTable(tableId);
    }
  }

  onCallWaiter(table: Table) {
    this.callClick$.next(table);
  }
}

