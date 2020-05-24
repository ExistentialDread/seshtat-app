import { Injectable } from '@angular/core';
import { Day } from '@data/models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  public clearCache$ = new Subject<void>();

  public daysCache: [{date: string, days: Day[][]}?] = [];
  public position = 0;
  public cacheSize = 6;

  constructor() { }

  public getCalendarDays(year, month): Day[][] {
    const cache = this.daysCache.find(e => e.date === `${month}-${year}`);
    if (cache) { return cache.days; }
    return null;
  }

  public clearCache() {
    this.daysCache = [];
    this.clearCache$.next();
  }

  public addToCache(year, month, days: Day[][]): void {
    const cache = {date: `${month}-${year}`, days};
    if (this.daysCache.length >= this.cacheSize) {
      this.daysCache[this.position] = cache;
    } else {
      this.daysCache.push(cache);
    }
    this.position = (this.position + 1) % this.cacheSize;
  }
}
