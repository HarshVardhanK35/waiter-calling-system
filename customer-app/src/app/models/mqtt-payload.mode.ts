export interface MqttPayload {
  tableId: string;
  status: 'CALLING' | 'ACKNOWLEDGED';
  timestamp: number;
}