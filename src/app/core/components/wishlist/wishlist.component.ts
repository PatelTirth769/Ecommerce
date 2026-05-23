import { Component, OnInit, OnDestroy } from '@angular/core';
import { WishlistService, WishlistItem } from '../../services/wishlist.service';
import { WebsiteItemService, ItemRecord } from '../../services/website-item.service';
import { Product } from '../../../modules/product/model';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistProducts: Product[] = [];
  isLoading = false;
  private wishlistSub!: Subscription;

  constructor(
    private wishlistService: WishlistService,
    private websiteItemService: WebsiteItemService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.wishlistSub = this.wishlistService.wishlist$.subscribe((items: WishlistItem[]) => {
      this.enrichWishlistItems(items);
    });
  }

  ngOnDestroy(): void {
    this.wishlistSub?.unsubscribe();
  }

  private enrichWishlistItems(items: WishlistItem[]): void {
    if (items.length === 0) {
      this.wishlistProducts = [];
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    const requests = items.map(item => {
      const identifier = item.item_code || item.website_item || '';
      return this.websiteItemService.resolveWebsiteItem(identifier).pipe(
        switchMap(webItem => {
          return forkJoin({
            webItem: of(webItem),
            erpItem: this.websiteItemService.getItem(webItem.item_code!).pipe(catchError(() => of(null as ItemRecord | null))),
            price: this.websiteItemService.getItemSellingPrice(webItem.item_code!, webItem.item_name).pipe(catchError(() => of(0)))
          });
        }),
        map(({ webItem, erpItem, price }) => this.mapToProduct(webItem, erpItem, price)),
        catchError(err => {
          console.error('[Wishlist] Failed to resolve item:', identifier, err);
          return of(null);
        })
      );
    });

    forkJoin(requests).subscribe(results => {
      this.wishlistProducts = results.filter((p): p is Product => p !== null);
      this.isLoading = false;
    });
  }

  private mapToProduct(webItem: any, erpItem: ItemRecord | null, price: number): Product {
    return {
      id: Math.random(), 
      title: webItem.web_item_name || webItem.item_name || webItem.name,
      description: webItem.web_long_description || webItem.description || '',
      category: webItem.item_group || 'Product',
      type: webItem.item_code || '',
      item_code: webItem.item_code || '',
      images: [this.websiteItemService.resolveImageUrl(webItem.website_image || webItem.thumbnail || '')],
      price: price || erpItem?.standard_rate || 0,
      prevprice: 0,
      stock: (erpItem?.disabled) ? 'Out of stock' : 'In stock',
      rating: {
        rate: 5,
        count: 0
      }
    };
  }
}
