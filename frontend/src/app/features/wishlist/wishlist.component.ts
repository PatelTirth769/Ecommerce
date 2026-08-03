import { Component, OnInit, OnDestroy } from '@angular/core';
import { WishlistService, WishlistItem } from '../../core/services/wishlist.service';
import { WebsiteItemService, ItemRecord } from '../../core/services/website-item.service';
import { Product } from '../../modules/product/model';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistProducts: Product[] = [];
  isLoading = false;
  private wishlistSub!: Subscription;
  // Resolved products keyed by item_code, so toggling one item never re-fetches
  // or re-renders the others (that was making the whole grid flash/reload).
  private productCache = new Map<string, Product>();
  // item_codes currently being fetched — WishlistService.refresh() can fire
  // more than once in quick succession (app-boot + this page's own refresh),
  // so without this guard the same item gets fetched and pushed twice.
  private pendingCodes = new Set<string>();

  constructor(
    private wishlistService: WishlistService,
    private websiteItemService: WebsiteItemService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    // Re-pull from the server on every visit to this page (not just at app
    // boot), so items added/removed from ERPNext's own site show up here too.
    this.wishlistService.refresh();
    this.wishlistSub = this.wishlistService.wishlist$.subscribe((items: WishlistItem[]) => {
      this.syncWishlistProducts(items);
    });
  }

  ngOnDestroy(): void {
    this.wishlistSub?.unsubscribe();
  }

  // Incrementally reconciles wishlistProducts with the current wishlist items:
  // removed items are just filtered out (no API calls, no flicker), and only
  // genuinely new items get fetched. The visible list is always rebuilt from
  // productCache (keyed by item_code) rather than pushed to, so duplicate or
  // overlapping refresh() emissions can never render the same item twice.
  private syncWishlistProducts(items: WishlistItem[]): void {
    const currentCodes = new Set(items.map(i => i.item_code));

    Array.from(this.productCache.keys()).forEach(code => {
      if (!currentCodes.has(code)) this.productCache.delete(code);
    });
    this.rebuildWishlistProducts(items);

    const newItems = items.filter(i => !this.productCache.has(i.item_code) && !this.pendingCodes.has(i.item_code));
    if (newItems.length === 0) {
      if (this.pendingCodes.size === 0) this.isLoading = false;
      return;
    }

    newItems.forEach(i => this.pendingCodes.add(i.item_code));

    const requests = newItems.map(item => {
      const itemCode = item.item_code;
      return forkJoin({
        erpItem: this.websiteItemService.getItem(itemCode).pipe(catchError(() => of(null as ItemRecord | null))),
        price: this.websiteItemService.getItemSellingPrice(itemCode, item.item_name || item.web_item_name).pipe(catchError(() => of(0)))
      }).pipe(
        map(({ erpItem, price }) => this.mapToProduct(item, erpItem, price)),
        catchError(err => {
          console.error('[Wishlist] Failed to resolve item:', itemCode, err);
          return of(null);
        })
      );
    });

    forkJoin(requests).subscribe(results => {
      results.forEach((product, index) => {
        const itemCode = newItems[index].item_code;
        this.pendingCodes.delete(itemCode);
        if (product) {
          this.productCache.set(itemCode, product);
        }
      });
      this.rebuildWishlistProducts(items);
      this.isLoading = false;
    });
  }

  private rebuildWishlistProducts(items: WishlistItem[]): void {
    const seen = new Set<string>();
    this.wishlistProducts = items
      .filter(i => (seen.has(i.item_code) ? false : (seen.add(i.item_code), true)))
      .map(i => this.productCache.get(i.item_code))
      .filter((p): p is Product => !!p);
  }

  trackByItemCode(index: number, product: Product): string {
    return product.item_code || product.title;
  }

  private mapToProduct(item: WishlistItem, erpItem: ItemRecord | null, price: number): Product {
    return {
      id: Math.random(),
      title: item.web_item_name || item.item_name || item.item_code,
      description: erpItem?.description || '',
      category: item.item_group || erpItem?.item_group || 'Product',
      type: item.item_code,
      item_code: item.item_code,
      images: [this.websiteItemService.resolveImageUrl(item.image || erpItem?.image || erpItem?.website_image || '')],
      price: price || erpItem?.standard_rate || 0,
      prevprice: Number((erpItem as any)?.custom_mrp) || 0,
      mrp: Number((erpItem as any)?.custom_mrp) || 0,
      stock: erpItem?.disabled ? 'Out of stock' : 'In stock',
      rating: {
        rate: 5,
        count: 0
      }
    };
  }
}
