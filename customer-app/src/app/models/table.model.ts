export type TableStatus = 'IDLE' | 'CALLING' | 'ACKNOWLEDGED';

export interface Table {
  tableId: string;
  tableNumber: number;
  description: string;
  status: TableStatus;
}
