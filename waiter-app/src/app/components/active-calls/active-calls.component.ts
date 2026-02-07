import { Component, inject } from '@angular/core';
import { WaiterCallService } from '../../services/waiter-call.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { Table } from '../../models/table.model';

@Component({
  selector: 'app-active-calls',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './active-calls.component.html',
  styleUrl: './active-calls.component.css'
})
export class ActiveCallsComponent {
  private waiterCallService = inject(WaiterCallService)
  activeTables$ = this.waiterCallService.callingTables$

  onAcknowledge(table: Table) {
    this.waiterCallService.acknowledgeTable(table.tableId)
  }
}
