import { Injectable } from '@angular/core';
import mqtt, { MqttClient } from 'mqtt';
import { BehaviorSubject, Observable } from 'rxjs';
// import { MqttPayload } from "../../models/mqtt-payload.mode";

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private client!: MqttClient;

  private connectedSubject = new BehaviorSubject<boolean>(false);
  connected$ = this.connectedSubject.asObservable();

  connect(clientId: string): void {
    this.client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
      clientId,
      protocol: 'wss',
      reconnectPeriod: 3000,
    });
    this.client.on('connect', () => {
      // this.clientConnectedToBroker = true
      // console.log('MQTT Connected (waiter):', clientId);
      this.connectedSubject.next(true);
    });
    this.client.on('error', err => {
      console.error('MQTT Error:', err);
    });
  }

  subscribe(topic: string): Observable<{ topic: string; payload: any }> {
    return new Observable(observer => {
      if (!this.client) {
        observer.error('MQTT client not initialized');
        return;
      }
      this.client.subscribe(topic, { qos: 1 });

      const messageHandler = (receivedTopic: string, message: Buffer) => {
        observer.next({
          topic: receivedTopic,
          payload: JSON.parse(message.toString()),
        });
      };
      this.client.on('message', messageHandler);

      return () => {
        this.client.unsubscribe(topic);
        this.client.off('message', messageHandler);
      };
    });
  }

  publish(topic: string, payload: unknown, retain = false): void {
    if (!this.client) {
      console.warn('MQTT publish skipped: client not initialized');
      return;
    }
    this.client.publish(
      topic,
      JSON.stringify(payload),
      {
        qos: 1,
        retain
      }
    );
    // console.log('MQTT publish:', topic, payload);
  }

}

// payload received: { tableId: string, status: 'CALLING', timestamp: number }