import { Component, inject } from '@angular/core';
import { CardsComponent } from '../shared/cards/cards.component';
import { TableData } from '../../services/table-data.service';

@Component({
  standalone: true,
  selector: 'app-table-list',
  imports: [CardsComponent],
  templateUrl: './table-list.html',
  styleUrl: './table-list.css',
})
export class TableList {
  private tableService = inject(TableData)

  tables = this.tableService.tables
}
