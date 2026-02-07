import { Injectable } from "@angular/core";
import mqtt, { MqttClient } from "mqtt"
import { Observable } from "rxjs";
import { MqttPayload } from "../../models/mqtt-payload.mode";

@Injectable({
  providedIn: "root"
})
export class MqttService {
  private client!: MqttClient;
  private clientConnectedToBroker = false

  connect(clientId: string): void {
    this.client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
      clientId,
      protocol: "wss",
      reconnectPeriod: 3000,
    })
    this.client.on("connect", () => {
      this.clientConnectedToBroker = true
      console.log("MQTT Connected: ", clientId);
    })
    this.client.on('error', (err) => {
      console.error('MQTT error', err);
    });
  }

  // publish<T extends MqttPayload>(topic: string; payload: T){}
  publish(topic: string, payload: unknown): void {
    if (!this.client || !this.clientConnectedToBroker) {
      // console.log("Broker is not connected.. publish is skipped!");
      return;
    }
    console.log('MQTT publish:', topic, payload);
    this.client.publish(topic, JSON.stringify(payload), {
      qos: 1,
    });
  }
}

// payload sent: { tableId: string, status: 'CALLING', timestamp: number }
// rest/tales/+/call