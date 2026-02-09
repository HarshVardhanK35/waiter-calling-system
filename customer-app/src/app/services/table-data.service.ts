import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Table, TableStatus } from '../models/table.model';

import { DUMMY_TABLES } from '../data/dummy-tables.data';

@Injectable({
  providedIn: 'root',
})
export class TableData {
  private tablesSubject = new BehaviorSubject<Table[]>(DUMMY_TABLES);

  tables$ = this.tablesSubject.asObservable();

  updateTableStatus(tableId: string, status: TableStatus) {
    // console.log('Updating table status:', tableId, status);
    const updatedTables = this.tablesSubject.value.map((table) => table.tableId === tableId ? { ...table, status: status } : table)
    this.tablesSubject.next(updatedTables)
  }
}
