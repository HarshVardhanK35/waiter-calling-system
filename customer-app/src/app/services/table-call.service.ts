import { inject, Injectable } from "@angular/core";

import { TableData } from "./table-data.service";

import { Table } from "../models/table.model";

@Injectable({
  providedIn: "root"
})
export class TableCallService {
  private tableData = inject(TableData)

  callWaiter(table: Table) {
    if (table.status === "CALLING") {
      return
    }
    this.tableData.updateTableStatus(table.tableId, "CALLING")
  }
}