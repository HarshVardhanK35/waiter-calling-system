import { Component, inject, OnInit } from "@angular/core";

import { WaiterDashboardComponent } from "./components/waiter-dashboard/waiter-dashboard.component";
import { MqttService } from "./services/mqtt/mqtt.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ WaiterDashboardComponent],
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit { 
  private mqttService = inject(MqttService);

  ngOnInit() {
    const clientId = 'waiter-' + Math.random().toString(16).slice(2);
    this.mqttService.connect(clientId);
  }
}