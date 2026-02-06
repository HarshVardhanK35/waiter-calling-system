import { Component, inject, OnInit } from "@angular/core";
import { HeaderComponent } from "./components/header/header.component";
import { TableDetails } from "./components/table-details/table-details.component";
import { MqttService } from "./services/mqtt/mqtt.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [HeaderComponent, TableDetails],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  private mqttService = inject(MqttService);

  ngOnInit() {
    const clientId = 'customer-' + Math.random().toString(16).slice(2);
    this.mqttService.connect(clientId);
  }
}
