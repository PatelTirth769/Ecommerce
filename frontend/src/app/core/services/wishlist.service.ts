import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from 'src/app/modules/product/model';

export interface WishlistItem {
  item_code: string;
  website_item?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly storageKey = 'erpnext_wishlist';
  private wishlistItems: WishlistItem[] = [];
  private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);

  public wishlist$: Observable<WishlistItem[]> = this.wishlistSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.wishlistItems = JSON.parse(data);
        this.wishlistSubject.next([...this.wishlistItems]);
      }
    } catch (e) {
      console.warn('[Wishlist] Failed to load from storage:', e);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.wishlistItems));
      this.wishlistSubject.next([...this.wishlistItems]);
    } catch (e) {
      console.warn('[Wishlist] Failed to save to storage:', e);
    }
  }

  public toggleWishlist(product: Product): Observable<WishlistItem[]> {
    const itemCode = product.item_code || product.type || '';
    if (!itemCode) return of(this.wishlistItems);

    const index = this.wishlistItems.findIndex(i => i.item_code === itemCode);
    if (index >= 0) {
      this.wishlistItems.splice(index, 1);
    } else {
      this.wishlistItems.push({ 
        item_code: itemCode,
        website_item: product.title // Using title as fallback for website_item if needed
      });
    }
    this.saveToStorage();
    return of(this.wishlistItems);
  }

  public isInWishlist(itemCode: string): boolean {
    return this.wishlistItems.some(i => i.item_code === itemCode);
  }

  public remove(itemCode: string): void {
    const index = this.wishlistItems.findIndex(i => i.item_code === itemCode);
    if (index >= 0) {
      this.wishlistItems.splice(index, 1);
      this.saveToStorage();
    }
  }

  public get count(): number {
    return this.wishlistItems.length;
  }
}
