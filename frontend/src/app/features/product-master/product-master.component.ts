import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ItemRecord, WebsiteItem, WebsiteItemService } from '../../core/services/website-item.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Product } from 'src/app/modules/product/model';
import { Subscription, catchError, forkJoin, map, of, switchMap } from 'rxjs';

interface ProductMasterItem extends WebsiteItem {
  erpPrice: number;
  erpUom: string;
  isOutOfStock: boolean;
  erpMrp?: number;
  erpPackSize?: string;
  erpShelfLifeInDays?: number;
  erpRemainingShelfLifeInDays?: number;
  erpVariantOf?: string;
  item_group?: string;
  erpDiscountedPrice?: number;  // pricing-rule adjusted price
  erpDiscountPct?: number;       // discount % for badge
}

@Component({
  selector: 'app-product-master',
  templateUrl: './product-master.component.html'
})
export class ProductMasterComponent implements OnInit, OnDestroy {
  allItems: ProductMasterItem[] = [];
  items: ProductMasterItem[] = [];
  cart: Product[] = [];
  isLoading = false;
  errorMessage = '';
  currentQuery = '';
  pageSize = 10;
  allItemsFilteredCount = 0;
  private fallbackImage = 'assets/images/logo.png';
  private cartSub!: Subscription;

  constructor(private websiteItemService: WebsiteItemService, private router: Router, private route: ActivatedRoute, private cartService: CartService) {}

  ngOnInit(): void {
    // Subscribe to cart changes so UI updates instantly on add/remove
    this.cartSub = this.cartService.cart$.subscribe(cartItems => {
      console.log('[ProductMaster] cart$ received', cartItems.length, 'items');
      this.cart = cartItems;
    });
    this.route.queryParams.subscribe(params => {
      this.currentQuery = (params['q'] || '').toLowerCase().trim();
      this.applyFilter();
    });
    this.loadItems();
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }

  loadItems(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.websiteItemService.getWebsiteItems(1000).subscribe({
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
              item: this.websiteItemService.getItem(itemCode).pipe(catchError(() => of(null as any))),
              sellingPrice: this.websiteItemService.getItemSellingPrice(itemCode, websiteItem.item_name).pipe(catchError(() => of(0)))
            }).pipe(
              map(({ item, sellingPrice }) => this.toProductMasterItem(websiteItem, item, sellingPrice)),
              catchError(() => of(this.toProductMasterItem(websiteItem, null, 0)))
            );
          })
        ).subscribe({
          next: (enrichedItems) => {
            // Group variants by template to override generic template prices
            const variantsByTemplate = new Map<string, ProductMasterItem[]>();
            
            enrichedItems.forEach(v => {
              let templateCode = v.erpVariantOf || (v as any).variant_of;
              
              if (!templateCode && v.item_code) {
                const variantItemCode = v.item_code;
                const template = enrichedItems.find(t => 
                  t.item_code && 
                  variantItemCode !== t.item_code && 
                  variantItemCode.startsWith(t.item_code + '-')
                );
                if (template) {
                  templateCode = template.item_code;
                }
              }

              if (templateCode) {
                if (!variantsByTemplate.has(templateCode)) {
                  variantsByTemplate.set(templateCode, []);
                }
                variantsByTemplate.get(templateCode)!.push(v);
              }
            });

            // Patch template products with real data from their variants
            enrichedItems.forEach(p => {
              if (p.item_code && variantsByTemplate.has(p.item_code)) {
                const variants = variantsByTemplate.get(p.item_code)!;
                if (variants.length > 0) {
                  variants.sort((a, b) => (a.erpPrice || 0) - (b.erpPrice || 0));
                  const firstVariant = variants.find(v => v.erpPrice > 0) || variants[0];
                  
                  p.erpPrice = firstVariant.erpPrice;
                  p.erpMrp = firstVariant.erpMrp;
                  p.erpPackSize = firstVariant.erpPackSize;
                }
              }
            });

            // Hide variants from the catalog if their template is already present to prevent duplicates
            const variantsToHide = new Set<string>();

            enrichedItems.forEach(v => {
              if (v.item_code && variantsByTemplate.has(v.item_code)) {
                // This 'v' is a template. We want to hide all its variants.
                const variants = variantsByTemplate.get(v.item_code)!;
                variants.forEach(variant => {
                  variantsToHide.add(variant.item_code || variant.name);
                });
              }
            });

            const baseItems = enrichedItems.filter(item => !variantsToHide.has(item.item_code || item.name));
            this.allItems = baseItems;
            this.applyFilter();

            // Apply pricing rule discounts — fetch all rules once, map to items
            this.websiteItemService.getAllActivePricingRules().subscribe(ruleMap => {
              this.allItems = this.allItems.map(item => {
                const ic = (item as any).item_code || item.name;
                const rule = ruleMap.get(ic);
                if (rule && (rule.discountPct > 0 || rule.fixedPrice > 0) && rule.minQty <= 1) {
                  const base = item.erpPrice;
                  const discounted = rule.fixedPrice > 0
                    ? rule.fixedPrice
                    : Math.round(base * (1 - rule.discountPct / 100));
                  return { ...item, erpDiscountedPrice: discounted, erpDiscountPct: rule.discountPct };
                }
                return item;
              });
              this.applyFilter();
              this.isLoading = false;
            });
            if (!this.allItems.length) this.isLoading = false;
          },
          error: () => {
            this.allItems = data.map((item) => this.toProductMasterItem(item, null, 0));
            this.applyFilter();
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

  applyFilter(): void {
    let filtered: ProductMasterItem[] = [];
    if (!this.currentQuery) {
      filtered = [...this.allItems];
    } else {
      filtered = this.allItems.filter(item => {
        const title = (item.web_item_name || item.item_name || item.name || '').toLowerCase();
        const desc = (item.web_long_description || '').toLowerCase();
        return title.includes(this.currentQuery) || desc.includes(this.currentQuery);
      });
    }

    this.allItemsFilteredCount = filtered.length;
    this.items = filtered.slice(0, this.pageSize);
  }

  setPageSize(size: number): void {
    this.pageSize = size;
    this.applyFilter();
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  private toProductMasterItem(websiteItem: any, item: any | null, sellingPrice: number): ProductMasterItem {
    return {
      ...websiteItem,
      erpPrice: Number(sellingPrice ?? 0) || Number(item?.standard_rate ?? 0),
      erpMrp: Number((item as any)?.custom_mrp) || Number((websiteItem as any)?.custom_mrp) || Number((item as any)?.mrp) || 0,
      erpPackSize: (item as any)?.custom_pack_size_ || (websiteItem as any)?.custom_pack_size_ || '',
      erpShelfLifeInDays: Number((item as any)?.shelf_life_in_days ?? (websiteItem as any)?.shelf_life_in_days ?? 0),
      erpRemainingShelfLifeInDays: this.calculateRemainingShelfLife(item),
      erpUom: item?.stock_uom || 'Nos',
      isOutOfStock: Boolean(item?.disabled),
      erpVariantOf: (item as any)?.variant_of || ''
    };
  }

  getPrice(item: ProductMasterItem): number {
    return item.erpPrice || 0;
  }

  getMrp(item: ProductMasterItem): number {
    return item.erpMrp || 0;
  }

  private calculateRemainingShelfLife(item: any): number {
    const shelfLife = Number(item?.shelf_life_in_days ?? 0);
    if (!shelfLife || shelfLife <= 0 || !item?.creation) {
      return shelfLife;
    }
    
    const creationDate = new Date(item.creation);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - creationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const remaining = shelfLife - diffDays;
    return remaining > 0 ? remaining : 0;
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

  getItemCode(item: ProductMasterItem): string {
    return item.name;
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
    const productForCart: Product = {
      id: 0,
      title: item.web_item_name || item.item_name || item.name,
      description: item.description || '',
      category: item.item_group || 'Product',
      type: item.item_code || item.name,
      item_code: item.item_code || item.name,
      images: [this.getImage(item)],
      stock: item.isOutOfStock ? 'Out of stock' : 'In stock',
      price: this.getPrice(item),
      prevprice: this.getMrp(item),
      mrp: this.getMrp(item),
      pack_size: item.erpPackSize,
      shelf_life_in_days: item.erpShelfLifeInDays,
      qty: 1,
      rating: { rate: 0, count: 0 }
    };
    return productForCart;
  }

  private getItemCartKey(item: ProductMasterItem): string {
    return String(item.item_code || item.item_name || item.name || '').trim().toLowerCase();
  }

  private getProductCartKey(product: Product): string {
    return String(product.item_code || product.type || product.id || product.title || '').trim().toLowerCase();
  }
}
