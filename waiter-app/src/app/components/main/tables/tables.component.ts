import { Component, inject } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';

import { WaiterCallService } from '../../../services/waiter-call.service';
import { Table } from '../../../models/table.model';

@Component({
  standalone: true,
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: '../tables.component.css',
  imports: [AsyncPipe, NgClass],
})
export class TablesComponent {
  private waiterCallService = inject(WaiterCallService);

  tables$ = this.waiterCallService.tables$;

  onAcknowledge(table: Table): void {
    this.waiterCallService.acknowledgeTable(table.tableId);
  }
}
