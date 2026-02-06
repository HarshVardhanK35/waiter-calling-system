import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, switchMap } from 'rxjs';

import { TableData } from './table-data.service';

@Injectable({ providedIn: 'root' })
export class TableSelectionService {
  private tableData = inject(TableData)

  private selectedTableIdSubject = new BehaviorSubject<string | null>(null);
  selectedTableId$ = this.selectedTableIdSubject.asObservable();

  selectedTable$ = this.selectedTableId$.pipe(
    filter((id): id is string => id !== null),
    switchMap(id =>
      this.tableData.tables$.pipe(
        map(tables => tables.find(t => t.tableId === id) ?? null)
      )
    )
  ); 
  selectTable(tableId: string) {
    this.selectedTableIdSubject.next(tableId);  
  }
}
