import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";

import { Table } from "../models/table.model";

import { DUMMY_TABLES } from "../data/dummy-tables.data";
// import { AlarmService } from "./alarm.service";
import { MqttService } from "./mqtt/mqtt.service";
import { StateStorageService } from "./state-storage.service";

@Injectable({
  providedIn: "root"
})
export class WaiterCallService {
  // private alarmService = inject(AlarmService)
  private mqttService = inject(MqttService)
  private storageService = inject(StateStorageService);

  private tablesSubject = new BehaviorSubject<Table[]>(DUMMY_TABLES)
  tables$ = this.tablesSubject.asObservable()



  callingTables$ = this.tables$.pipe(
    map(tables => tables.filter(table => table.status === "CALLING"))
  )

  constructor() {

    // if (this.tablesSubject.value.some(table => table.status === 'CALLING')) {
    //   this.alarmService.startAlarm();
    // }

    this.storageService.init().then(async () => {
      const storedCalls = await this.storageService.getAllCalling();

      if (storedCalls.length) {
        const restored = this.tablesSubject.value.map(table =>
          storedCalls.some(c => c.tableId === table.tableId)
            ? { ...table, status: 'CALLING' as const }
            : table
        );
        this.tablesSubject.next(restored);
      }
    });

    this.mqttService.connected$.subscribe(connected => {
      if (connected) {
        this.mqttService
          .subscribe('restaurant/table/+/call')
          .subscribe(({ payload }) => {
            if (!payload || !payload.tableId) {
              return;
            }
            this.markAsCalling(payload.tableId);
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
    this.storageService.saveCalling(tableId);
  }

  acknowledgeTable(tableId: string) {
    const updated = this.tablesSubject.value.map(table =>
      table.tableId === tableId
        ? { ...table, status: 'ACKNOWLEDGED' as const }
        : table
    );
    this.tablesSubject.next(updated);

    this.mqttService.publish(
      `restaurant/table/${tableId}/ack`,
      {
        tableId,
        status: 'ACKNOWLEDGED',
        timestamp: Date.now(),
      }
    );

    this.mqttService.publish(
      `restaurant/table/${tableId}/call`,
      '',
      true
    );

    this.storageService.removeCalling(tableId);
    // this.alarmService.stopAlarm()
  }
}

