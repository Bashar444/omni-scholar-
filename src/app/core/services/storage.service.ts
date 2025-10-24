import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface StorageItem {
  key: string;
  value: any;
  timestamp: number;
  expiresAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly DB_NAME = 'omnischolar_db';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'cache';
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  /**
   * Initialize IndexedDB
   */
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const objectStore = db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };
    });
  }

  /**
   * Set item in IndexedDB
   */
  setItem(key: string, value: any, ttl?: number): Observable<boolean> {
    const item: StorageItem = {
      key,
      value,
      timestamp: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : undefined
    };

    return from(this.putItem(item)).pipe(
      map(() => true),
      catchError((error) => {
        console.error(`Failed to set item ${key}:`, error);
        return of(false);
      })
    );
  }

  /**
   * Get item from IndexedDB
   */
  getItem<T>(key: string): Observable<T | null> {
    return from(this.retrieveItem(key)).pipe(
      map((item: StorageItem | null) => {
        if (!item) return null;

        // Check if item has expired
        if (item.expiresAt && Date.now() > item.expiresAt) {
          this.removeItem(key);
          return null;
        }

        return item.value as T;
      }),
      catchError((error) => {
        console.error(`Failed to get item ${key}:`, error);
        return of(null);
      })
    );
  }

  /**
   * Remove item from IndexedDB
   */
  removeItem(key: string): Observable<boolean> {
    return from(this.deleteItem(key)).pipe(
      map(() => true),
      catchError((error) => {
        console.error(`Failed to remove item ${key}:`, error);
        return of(false);
      })
    );
  }

  /**
   * Clear all items from IndexedDB
   */
  clear(): Observable<boolean> {
    return from(this.clearStore()).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Failed to clear storage:', error);
        return of(false);
      })
    );
  }

  /**
   * Get all keys from IndexedDB
   */
  getAllKeys(): Observable<string[]> {
    return from(this.retrieveAllKeys()).pipe(
      catchError((error) => {
        console.error('Failed to get all keys:', error);
        return of([]);
      })
    );
  }

  /**
   * Put item into IndexedDB (Promise-based)
   */
  private async putItem(item: StorageItem): Promise<void> {
    if (!this.db) await this.initDB();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieve item from IndexedDB (Promise-based)
   */
  private async retrieveItem(key: string): Promise<StorageItem | null> {
    if (!this.db) await this.initDB();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete item from IndexedDB (Promise-based)
   */
  private async deleteItem(key: string): Promise<void> {
    if (!this.db) await this.initDB();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all items from store (Promise-based)
   */
  private async clearStore(): Promise<void> {
    if (!this.db) await this.initDB();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all keys from store (Promise-based)
   */
  private async retrieveAllKeys(): Promise<string[]> {
    if (!this.db) await this.initDB();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAllKeys();

      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => reject(request.error);
    });
  }
}
