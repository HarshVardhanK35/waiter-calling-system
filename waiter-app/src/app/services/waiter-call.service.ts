import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";

import { Table } from "../models/table.model";

import { DUMMY_TABLES } from "../data/dummy-tables.data";
// import { AlarmService } from "./alarm.service";
import { MqttService } from "./mqtt/mqtt.service";

@Injectable({
  providedIn: "root"
})
export class WaiterCallService {
  // private alarmService = inject(AlarmService)
  private mqttService = inject(MqttService)

  private tablesSubject = new BehaviorSubject<Table[]>(DUMMY_TABLES)
  tables$ = this.tablesSubject.asObservable()

  // constructor() {
  //   if (this.tablesSubject.value.some(table => table.status === 'CALLING')) {
  //     this.alarmService.startAlarm();
  //   }
  // }

  callingTables$ = this.tables$.pipe(
    map(tables => tables.filter(table => table.status === "CALLING"))
  )

  constructor() {
    this.mqttService.connected$
      .subscribe(isConnected => {
        if (isConnected) {
          this.mqttService
            .subscribe('restaurant/table/+/call')
            .subscribe(({ payload }) => {
              console.log('MQTTpayload received:', payload);
              const tableId = payload.tableId;
              this.markAsCalling(tableId);
            });
        }
      });

    if (this.tablesSubject.value.some(table => table.status === 'CALLING')) {
      // this.alarmService.startAlarm();
    }
  }

  markAsCalling(tableId: string) {
    const updatedTables = this.tablesSubject.value.map((table): Table => {
      if (table.tableId === tableId && table.status !== 'CALLING') {
        return { ...table, status: 'CALLING' }
      }
      return table
    });
    this.tablesSubject.next(updatedTables);

    if (updatedTables.some(table => table.status === 'CALLING')) {
      // this.alarmService.startAlarm();
    }
  }

  acknowledgeTable(tableId: string) {
    const updatedTables = this.tablesSubject.value.map((table): Table => {
      if (table.tableId === tableId) {
        return { ...table, status: 'ACKNOWLEDGED' }
      }
      return table
    });
    this.tablesSubject.next(updatedTables);

    this.mqttService.publish(
      `restaurant/table/${tableId}/ack`,
      { tableId, status: 'ACKNOWLEDGED', timestamp: Date.now() }
    );

    this.mqttService.publish(
      `restaurant/table/${tableId}/call`,
      '',
      true // retain = true
    );

    if (!updatedTables.some(table => table.status === 'CALLING')) {
      // this.alarmService.stopAlarm();
    }
  }
}

