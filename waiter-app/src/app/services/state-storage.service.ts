import { Injectable } from "@angular/core";

interface StoredCallingTable {
  tableId: string;
  status: 'CALLING',
  timestamp: number
}

@Injectable({
  providedIn: "root"
})
export class StateStorageService {
  private db!: IDBDatabase;

  private readonly DB_NAME = 'waiter-db';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'calling_tables';

  /** Initialize IndexedDB */
  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, {
            keyPath: 'tableId',
          });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => {
        console.error('IndexedDB init failed');
        reject(request.error);
      };
    });
  }

  /** Save a CALLING table */
  saveCalling(tableId: string): void {
    if (!this.db) return;

    const tx = this.db.transaction(this.STORE_NAME, 'readwrite');
    const store = tx.objectStore(this.STORE_NAME);

    const record: StoredCallingTable = {
      tableId,
      status: 'CALLING',
      timestamp: Date.now(),
    };

    store.put(record);
  }

  /** Remove a resolved call */
  removeCalling(tableId: string): void {
    if (!this.db) return;

    const tx = this.db.transaction(this.STORE_NAME, 'readwrite');
    const store = tx.objectStore(this.STORE_NAME);

    store.delete(tableId);
  }

  /** Restore all unresolved calls */
  getAllCalling(): Promise<StoredCallingTable[]> {
    return new Promise((resolve) => {
      if (!this.db) {
        resolve([]);
        return;
      }

      const tx = this.db.transaction(this.STORE_NAME, 'readonly');
      const store = tx.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as StoredCallingTable[]);
      };

      request.onerror = () => {
        console.warn('Failed to read IndexedDB');
        resolve([]);
      };
    });
  }
}