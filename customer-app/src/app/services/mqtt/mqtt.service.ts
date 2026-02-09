import { Injectable } from "@angular/core";
import mqtt, { MqttClient } from "mqtt"
import { BehaviorSubject, Observable } from "rxjs";
import { MqttPayload } from "../../models/mqtt-payload.mode";

@Injectable({
  providedIn: "root"
})
export class MqttService {
  private client!: MqttClient;
  private connectedSubject = new BehaviorSubject<boolean>(false);
  connected$ = this.connectedSubject.asObservable();

  connect(clientId: string): void {
    this.client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
      clientId,
      protocol: "wss",
      reconnectPeriod: 3000,
    })
    this.client.on("connect", () => {
      // this.clientConnectedToBroker = true;
      this.connectedSubject.next(true);
      console.log("MQTT Connected: ", clientId);
    });
    this.client.on('error', (err) => {
      console.error('MQTT error', err);
    });
  }

  subscribe(topic: string) {
    return new Observable<{ topic: string; payload: any }>(observer => {
      if (!this.client) {
        observer.error('MQTT client not initialized');
        return;
      }
      this.client.subscribe(topic, { qos: 1 });

      const handler = (receivedTopic: string, message: Buffer) => {
        observer.next({
          topic: receivedTopic,
          payload: JSON.parse(message.toString()),
        });
      };
      this.client.on('message', handler);

      return () => {
        this.client.unsubscribe(topic);
        this.client.off('message', handler);
      };
    });
  }

  // publish<T extends MqttPayload>(topic: string; payload: T){}
  publish(topic: string, payload: unknown): void {
    if (!this.client) {
      // console.log("Broker is not connected.. publish is skipped!");
      return;
    }
    // console.log('MQTT publish:', topic, payload);
    this.client.publish(topic, JSON.stringify(payload), {
      qos: 1,
    });
  }

}

// payload sent: { tableId: string, status: 'CALLING', timestamp: number }
// rest/tales/+/call