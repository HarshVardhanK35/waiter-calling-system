import { inject, Injectable } from "@angular/core";

import { TableData } from "./table-data.service";

import { Table } from "../models/table.model";
import { MqttService } from "./mqtt/mqtt.service";

@Injectable({
  providedIn: 'root',
})
export class TableCallService {
  private tableData = inject(TableData);
  private mqttService = inject(MqttService);

  constructor() {
    this.mqttService.connected$
      .subscribe(isConnected => {
        if (isConnected) {
          this.mqttService
            .subscribe('restaurant/table/+/ack')
            .subscribe(({ payload }) => {
              // console.log('ACK RECEIVED ON CUSTOMER:', payload);
              this.tableData.updateTableStatus(payload.tableId, 'ACKNOWLEDGED');
            });
        }
      });
  }


  callWaiter(table: Table) {
    if (table.status === 'CALLING') {
      return;
    }
    this.mqttService.publish(
      `restaurant/table/${table.tableId}/call`,
      {
        tableId: table.tableId,
        status: 'CALLING',
        timestamp: Date.now(),
      }
    )
    this.tableData.updateTableStatus(table.tableId, 'CALLING');
  }
}