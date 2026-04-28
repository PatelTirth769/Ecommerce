import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ItemRecord, WebsiteItem, WebsiteItemService } from '../../services/website-item.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from 'src/app/modules/product/model';
import { catchError, forkJoin, map, of, Subscription } from 'rxjs';

interface ProductMasterItem extends WebsiteItem {
  erpPrice: number;
  erpUom: string;
  isOutOfStock: boolean;
}

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html'
})
export class ProductMasterComponent implements OnInit, OnDestroy {
  items: ProductMasterItem[] = [];
  cart: Product[] = [];
  isLoading = false;
  errorMessage = '';
  private fallbackImage = 'assets/images/logo.png';
  private cartSub!: Subscription;

  constructor(private websiteItemService: WebsiteItemService, private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSub = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
    this.loadItems();
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }

  loadItems(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.websiteItemService.getWebsiteItems().subscribe({
      next: (data) => {
        if (!data.length) {
          this.items = [];
          this.isLoading = false;
          return;
        }

        forkJoin(
          data.map((websiteItem) => {
            const itemCode = websiteItem.item_code || websiteItem.item_name || websiteItem.name;
            return forkJoin({
              item: this.websiteItemService.getItem(itemCode).pipe(catchError(() => of(null as ItemRecord | null))),
              sellingPrice: this.websiteItemService.getItemSellingPrice(itemCode, websiteItem.item_name).pipe(catchError(() => of(0)))
            }).pipe(
              map(({ item, sellingPrice }) => this.toProductMasterItem(websiteItem, item, sellingPrice)),
              catchError(() => of(this.toProductMasterItem(websiteItem, null, 0)))
            );
          })
        ).subscribe({
          next: (enrichedItems) => {
            this.items = enrichedItems;
            this.isLoading = false;
          },
          error: () => {
            this.items = data.map((item) => this.toProductMasterItem(item, null, 0));
            this.isLoading = false;
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'Login required. Please login and open All Product again.';
          return;
        }

        this.errorMessage = 'Unable to fetch ERP products right now.';
      }
    });
  }

  private toProductMasterItem(websiteItem: WebsiteItem, item: ItemRecord | null, sellingPrice: number): ProductMasterItem {
    return {
      ...websiteItem,
      erpPrice: Number(item?.standard_rate ?? 0) || Number(sellingPrice ?? 0),
      erpUom: item?.stock_uom || 'Nos',
      isOutOfStock: Boolean(item?.disabled)
    };
  }

  getPrice(item: ProductMasterItem): number {
    return Number(item.erpPrice ?? 0);
  }

  getUom(item: ProductMasterItem): string {
    return item.erpUom || 'Nos';
  }

  isOutOfStock(item: ProductMasterItem): boolean {
    return Boolean(item.isOutOfStock);
  }

  getDisplayName(item: ProductMasterItem): string {
    return item.web_item_name || item.item_name || item.name;
  }

  getImage(item: ProductMasterItem): string {
    return this.websiteItemService.resolveImageUrl(item.website_image || item.thumbnail || '');
  }

  onImageError(event: any): void {
    event.target.src = this.fallbackImage;
  }

  getDetailIdentifier(item: ProductMasterItem): string {
    return item.route?.replace(/^\//, '') || item.item_code || item.item_name || item.name;
  }

  addToCart(item: ProductMasterItem): void {
    this.cartService.add(this.toCartProduct(item));
  }

  removeFromCart(item: ProductMasterItem): void {
    this.cartService.remove(this.toCartProduct(item));
  }

  isItemInCart(item: ProductMasterItem): boolean {
    const key = this.getItemCartKey(item);
    return this.cart.some((cartItem) => this.getProductCartKey(cartItem) === key);
  }

  private toCartProduct(item: ProductMasterItem): Product {
    return {
      id: 0,
      title: this.getDisplayName(item),
      description: item.description || '',
      category: 'ERPNext Item',
      type: item.item_code || item.item_name || item.name,
      sizes: [],
      images: [this.getImage(item)],
      stock: this.isOutOfStock(item) ? 'Out of stock' : 'In stock',
      price: this.getPrice(item),
      prevprice: 0,
      item_code: item.item_code || item.item_name || item.name,
      rating: {
        rate: 0,
        count: 0
      }
    };
  }

  private getItemCartKey(item: ProductMasterItem): string {
    return String(item.item_code || item.item_name || item.name || '').trim().toLowerCase();
  }

  private getProductCartKey(product: Product): string {
    return String(product.item_code || product.type || product.id || product.title || '').trim().toLowerCase();
  }
}
