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

  subscribe(topic: string): Observable<{ topic: string; message: string }> {
    return new Observable(observer => {
      if (!this.client) {
        observer.error("client is not initialized!")
        return
      }
      this.client.subscribe(topic, { qos: 1 })

      const messageHandler = (receivedTopic: string, message: Buffer) => {
        if (receivedTopic === topic) {
          observer.next({
            topic: receivedTopic,
            message: message.toString()
          })
        }
      }
      this.client.on("message", messageHandler)

      return (() => {
        this.client.unsubscribe(topic)
        this.client.off("message", messageHandler)
      })
    })
  }

  // publish<T extends MqttPayload>(topic: string; payload: T){}
  publish(topic: string, payload: unknown): void {
    if (!this.client || !this.clientConnectedToBroker) {
      console.log("Broker is not connected.. publish is skipped!");
      return;
    }
    // console.log('MQTT publish:', topic, payload);
    this.client.publish(topic, JSON.stringify(payload), {
      qos: 1,
    });
  }
}