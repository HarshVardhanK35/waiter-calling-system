import { Component, inject } from '@angular/core';
import { WaiterCallService } from '../../../services/waiter-call.service';
import { AsyncPipe } from '@angular/common';
import { Table } from '../../../models/table.model';

@Component({
  selector: 'app-active-tables',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './active-tables.component.html',
  styleUrl: "../tables.component.css"
})
export class ActiveTablesComponent {
  private waiterCallService = inject(WaiterCallService)
  activeTables$ = this.waiterCallService.callingTables$

  onAcknowledge(table: Table) {
    this.waiterCallService.acknowledgeTable(table.tableId)
  }
}
