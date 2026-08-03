import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, PricingRuleSlabDetail, WholesalePricingTier } from 'src/app/modules/product/model';
import { ProductService } from 'src/app/modules/product/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WebsiteItemService, PricingRuleSlab } from 'src/app/core/services/website-item.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit{
  products:any[]=[];
  originalWebsiteItems: any[] = [];
  allWebsiteItems: any[] = [];
  searchQuery = '';
  cart: Product[] = [];
  skeletons:number[]=[...new Array(6)];
  error!:string;
  isLoading=false;
  isFetchingMore = false;
  hasMore = true;
  currentPage = 0;
  pageSize = 12;
  images:string[]=[
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&h=500&q=80",
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&h=500&q=80",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&h=500&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&h=500&q=80"
  ];

  constructor(private _productService:ProductService, private cartService: CartService, private websiteItemService: WebsiteItemService, private route: ActivatedRoute){
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.isLoading || this.isFetchingMore || !this.hasMore) return;
    
    // Check if scrolled to bottom
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.clientHeight;
    const max = document.documentElement.scrollHeight;
    
    if (pos >= max - 200) {
      this.loadMoreProducts();
    }
  }

  ngOnInit(): void {
   this.route.queryParams.subscribe(params => {
     this.searchQuery = (params['q'] || '').toLowerCase().trim();
     if (this.originalWebsiteItems.length > 0) {
       this.applyFilter();
     }
   });
   this.cart = this.cartService.getCart;
   const audit = sessionStorage.getItem('login_audit');
   if (audit) {
    try {
      const parsed = JSON.parse(audit);
      console.warn('LOGIN SUCCESS VERIFIED', parsed);
    } catch {
      console.warn('LOGIN SUCCESS VERIFIED');
    }
    sessionStorage.removeItem('login_audit');
   }
   this.newArrivalProducts();
  }

  newArrivalProducts(){
    this.isLoading=true;
    this.websiteItemService.getWebsiteItems().subscribe({
      next: (data) => {
        if (!data.length) {
          this.products = [];
          this.isLoading = false;
          return;
        }

        // Shuffle all products to show a random order
        this.originalWebsiteItems = data.sort(() => 0.5 - Math.random());
        this.isLoading = false;
        
        // Apply search filter and load first batch
        this.applyFilter();
      },
      error: (error) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    if (this.searchQuery) {
      this.allWebsiteItems = this.originalWebsiteItems.filter(item => {
        const title = (item.web_item_name || item.item_name || item.name || '').toLowerCase();
        const desc = (item.description || item.short_description || '').toLowerCase();
        const group = (item.item_group || '').toLowerCase();
        return title.includes(this.searchQuery) || desc.includes(this.searchQuery) || group.includes(this.searchQuery);
      });
    } else {
      this.allWebsiteItems = [...this.originalWebsiteItems];
    }
    
    this.products = [];
    this.currentPage = 0;
    this.hasMore = true;
    this.loadMoreProducts();
  }

  loadMoreProducts() {
    if (this.isFetchingMore || !this.hasMore) return;
    
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const selected = this.allWebsiteItems.slice(startIndex, endIndex);
    
    if (selected.length === 0) {
      this.hasMore = false;
      return;
    }

    this.isFetchingMore = true;

    forkJoin(
      selected.map((websiteItem) => {
        const itemCode = websiteItem.item_code || websiteItem.item_name || websiteItem.name;
        return forkJoin({
          item: this.websiteItemService.getItem(itemCode).pipe(catchError(() => of(null as any))),
          sellingPrice: this.websiteItemService.getItemSellingPrice(itemCode, websiteItem.item_name).pipe(catchError(() => of(0)))
        }).pipe(
          map(({ item, sellingPrice }) => this.toProduct(websiteItem, item, sellingPrice)),
          catchError(() => of(this.toProduct(websiteItem, null, 0)))
        );
      })
    ).subscribe({
      next: (enrichedItems: any[]) => {
        this.websiteItemService.getAllActivePricingRuleSlabs().subscribe(slabMap => {
          const newProducts = enrichedItems.map(item => {
            const ic = item.item_code || item.name;
            const rules = slabMap.get(ic) || [];
            const base = item.price;
            const pricingRuleSlabs = this.resolvePricingRuleSlabs(rules, base);

            const badgeRule = rules
              .filter((r: PricingRuleSlab) => r.minQty <= 1 && (r.discountPercentage > 0 || r.fixedPrice > 0 || r.discountAmount > 0))
              .sort((a: PricingRuleSlab, b: PricingRuleSlab) => b.discountPercentage - a.discountPercentage)[0];

            if (badgeRule) {
              const discounted = this.resolveSlabPrice(badgeRule, base);
              const discountPct = badgeRule.discountPercentage > 0
                ? badgeRule.discountPercentage
                : (base > 0 ? Math.round(((base - discounted) / base) * 100) : 0);
              return {
                ...item,
                erpDiscountedPrice: discounted,
                erpDiscountPct: discountPct,
                pricingRuleSlabs
              };
            }
            return { ...item, pricingRuleSlabs };
          });
          
          this.products = [...this.products, ...newProducts];
          this.currentPage++;
          this.isFetchingMore = false;
          
          if (this.products.length >= this.allWebsiteItems.length) {
            this.hasMore = false;
          }
        });
      },
      error: () => {
        const fallbackProducts = selected.map((item) => this.toProduct(item, null, 0));
        this.products = [...this.products, ...fallbackProducts];
        this.currentPage++;
        this.isFetchingMore = false;
      }
    });
  }

  private toProduct(websiteItem: any, item: any | null, sellingPrice: number): any {
    const images = [];
    if (websiteItem.website_image) images.push(websiteItem.website_image);
    if (item?.image) images.push(item.image);
    if (item?.website_image) images.push(item.website_image);
    if (images.length === 0) images.push('assets/images/logo.png');

    const rawDesc = websiteItem.description || websiteItem.short_description || item?.description || '';

    const rawWholesale = item?.custom_wholesale_pricing || [];
    const wholesaleTiers: WholesalePricingTier[] = Array.isArray(rawWholesale) ? rawWholesale.map((tier: any) => ({
      minimum_quantity: Number(tier.minimum_quantity || 0),
      maximum_quantity: Number(tier.maximum_quantity || 0),
      unit: tier.unit,
      price: Number(tier.price || 0),
      discount_: Number(tier.discount_ || 0),
      active: Number(tier.active || 0)
    })) : [];

    return {
      id: websiteItem.name,
      title: websiteItem.web_item_name || websiteItem.item_name || websiteItem.name,
      description: rawDesc,
      category: websiteItem.item_group || item?.item_group || '',
      type: websiteItem.item_group || '',
      sizes: [],
      images: images,
      stock: item?.is_stock_item ? 'In stock' : (item?.is_stock_item === 0 ? 'Out of stock' : 'In stock'),
      price: sellingPrice || websiteItem.standard_rate || item?.standard_rate || 0,
      prevprice: item?.custom_mrp || item?.mrp || 0,
      item_code: websiteItem.item_code || websiteItem.name,
      erpPackSize: item?.custom_pack_size_ || websiteItem?.custom_pack_size_ || '',
      erpShelfLifeInDays: Number(item?.shelf_life_in_days ?? websiteItem?.shelf_life_in_days ?? 0),
      erpRemainingShelfLifeInDays: this.calculateRemainingShelfLife(item),
      erpUom: item?.stock_uom || 'Nos',
      isOutOfStock: Boolean(item?.disabled),
      published: websiteItem.published !== 0,
      modified: websiteItem.modified || item?.modified || new Date(),
      wholesale_pricing_tiers: wholesaleTiers
    };
  }

  // Resolve a raw ERPNext Pricing Rule (fixed price / discount % / flat discount amount)
  // into a concrete per-unit price against a base price.
  private resolveSlabPrice(r: PricingRuleSlab, basePrice: number): number {
    if (r.fixedPrice > 0) return r.fixedPrice;
    if (r.discountPercentage > 0) return Math.round(basePrice * (1 - r.discountPercentage / 100));
    if (r.discountAmount > 0) return Math.max(basePrice - r.discountAmount, 0);
    return basePrice;
  }

  // Resolve raw ERPNext Pricing Rule slabs into concrete per-unit prices against a base
  // price, mirroring productdetail.buildPricingRuleSlabs so cart.service's
  // calculateItemUnitPrice sees the same shape regardless of where the item was added from.
  private resolvePricingRuleSlabs(rules: PricingRuleSlab[], basePrice: number): PricingRuleSlabDetail[] {
    return rules
      .filter(r => r.discountPercentage > 0 || r.fixedPrice > 0 || r.discountAmount > 0)
      .map(r => ({
        minQty: r.minQty,
        maxQty: r.maxQty,
        price: this.resolveSlabPrice(r, basePrice)
      }))
      .sort((a, b) => a.minQty - b.minQty);
  }

  addToCart(product: Product): void {
    this.cartService.add(product);
    this.cart = this.cartService.getCart;
  }

  removeFromCart(product: Product): void {
    this.cartService.remove(product);
    this.cart = this.cartService.getCart;
  }

  isProductInCart(product: Product): boolean {
    return this.cart.some((item) => this.getCartKey(item) === this.getCartKey(product));
  }

  private getCartKey(product: Product): string {
    return String(product.item_code || product.type || product.id || product.title || '').trim().toLowerCase();
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

  private cleanDescription(value: string): string {
    if (!value) {
      return '';
    }

    try {
      // Decode HTML entities
      const txt = document.createElement('textarea');
      txt.innerHTML = value;
      let decoded = txt.value;

      // Handle potential double encoding
      if (decoded.includes('&lt;') || decoded.includes('&gt;') || decoded.includes('<')) {
        txt.innerHTML = decoded;
        decoded = txt.value;
      }

      // Strip HTML tags using parser
      const parserNode = document.createElement('div');
      parserNode.innerHTML = decoded;
      
      return (parserNode.textContent || parserNode.innerText || '')
        .replace(/[ \t]+/g, ' ')
        .trim();
    } catch (e) {
      // Fallback regex if DOMParser/document fails (e.g. in environments without DOM)
      return value.replace(/<[^>]*>/g, '').trim();
    }
  }
}
