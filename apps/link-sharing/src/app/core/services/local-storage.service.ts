import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import type { ClientSideStorage } from '../models/client-side-storage.model';

@Injectable({ providedIn: 'root' })
export class LocalStorageService implements ClientSideStorage {
  private readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  public get<T>(key: string): T | null {
    if (!this.isBrowser) {
      return null;
    }

    const value = localStorage.getItem(key);

    return value === null ? null : (JSON.parse(value) as T);
  }

  public set<T>(key: string, value: T): void {
    if (!this.isBrowser) {
      return;
    }

    const serializedValue = JSON.stringify(value);

    if (serializedValue === undefined) {
      throw new TypeError('Value is not JSON-serializable.');
    }

    localStorage.setItem(key, serializedValue);
  }

  public delete(key: string): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.removeItem(key);
  }

  public clear(): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.clear();
  }
}
