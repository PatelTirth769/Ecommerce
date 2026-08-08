import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, forkJoin, switchMap } from 'rxjs';
import { Product, PricingRuleSlabDetail } from '../model';
import { WebsiteItemService, PricingRuleSlab } from '../../../core/services/website-item.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products = new BehaviorSubject<Product[]>([]);
  ratingList: boolean[] = [];

  constructor(
    private http: HttpClient,
    private websiteItemService: WebsiteItemService
  ) {}

  private normalizeValue(value: string): string {
    return value.trim().toLowerCase();
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

  private fetchProductsFromERP(): Observable<Product[]> {
    const websiteItemParams = new HttpParams()
      .set('fields', JSON.stringify(['name', 'item_name', 'item_code', 'web_item_name', 'route', 'website_image', 'thumbnail', 'description', 'published', 'modified', 'stock_uom']))
      .set('limit_page_length', '1000');

    const itemParams = new HttpParams()
      .set('fields', JSON.stringify(['name', 'item_name', 'item_group', 'standard_rate', 'image', 'custom_mrp', 'custom_wholesale_pricing', 'disabled', 'creation', 'shelf_life_in_days', 'custom_pack_size_', 'stock_uom', 'modified']))
      .set('limit_page_length', '1000');

    const priceParams = new HttpParams()
      .set('fields', JSON.stringify(['item_code', 'price_list_rate', 'selling']))
      .set('limit_page_length', '1000');

    return forkJoin({
      webItems: this.http.get<any>('/api/resource/Website%20Item', { params: websiteItemParams }),
      items: this.http.get<any>('/api/resource/Item', { params: itemParams }),
      prices: this.http.get<any>('/api/resource/Item%20Price', { params: priceParams })
    }).pipe(
      switchMap(({ webItems, items, prices }: { webItems: any, items: any, prices: any }) => {
        const webList = Array.isArray(webItems?.data) ? webItems.data : [];
        const itemList = Array.isArray(items?.data) ? items.data : [];
        const priceList = Array.isArray(prices?.data) ? prices.data : [];

        const products: Product[] = [];

        webList.forEach((webItem: any) => {
          const matchedItem = itemList.find((item: any) => item.name === webItem.item_code);
          const matchedPrice = priceList.find((price: any) => price.item_code === webItem.item_code);

          // Skip if item is disabled
          if (matchedItem && matchedItem.disabled) {
            return;
          }

          const rawImage = webItem.website_image || (matchedItem ? matchedItem.image : '');
          const resolvedImage = this.websiteItemService.resolveImageUrl(rawImage);

          const finalPrice = matchedPrice ? Number(matchedPrice.price_list_rate || 0) : Number(matchedItem?.standard_rate || 0);
          const finalMrp = matchedItem ? Number(matchedItem.custom_mrp || matchedItem.mrp || 0) : finalPrice;

          const rawWholesale = matchedItem?.custom_wholesale_pricing || [];
          const wholesaleTiers = Array.isArray(rawWholesale) ? rawWholesale.map((tier: any) => ({
            minimum_quantity: Number(tier.minimum_quantity || 0),
            maximum_quantity: Number(tier.maximum_quantity || 0),
            unit: tier.unit,
            price: Number(tier.price || 0),
            discount_: Number(tier.discount_ || 0),
            active: Number(tier.active || 0)
          })) : [];

          // Format unique ID mapping safely
          let numericId = 0;
          if (webItem.name) {
            const matches = webItem.name.match(/\d+/);
            numericId = matches ? Number(matches[0]) : 0;
          }

          // Calculate remaining shelf life
          let remainingShelfLife: number | undefined;
          if (matchedItem) {
            const shelfLife = Number(matchedItem.shelf_life_in_days ?? 0);
            if (shelfLife > 0 && matchedItem.creation) {
              const creationDate = new Date(matchedItem.creation);
              const now = new Date();
              const diffTime = Math.abs(now.getTime() - creationDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const remaining = shelfLife - diffDays;
              remainingShelfLife = remaining > 0 ? remaining : 0;
            } else {
              remainingShelfLife = shelfLife > 0 ? shelfLife : undefined;
            }
          }

          products.push({
            id: webItem.name || webItem.route || String(numericId),
            title: webItem.web_item_name || webItem.item_name || matchedItem?.item_name || '',
            description: webItem.description || matchedItem?.description || '',
            category: matchedItem?.item_group || webItem.item_group || '',
            type: matchedItem?.item_group || '',
            sizes: [],
            images: [resolvedImage],
            stock: matchedItem?.disabled ? 'Out of stock' : 'In stock',
            price: finalPrice,
            prevprice: finalMrp,
            mrp: finalMrp,
            pack_size: matchedItem?.custom_pack_size_ || webItem.custom_pack_size_ || '',
            shelf_life_in_days: Number(matchedItem?.shelf_life_in_days ?? webItem.shelf_life_in_days ?? 0),
            erpRemainingShelfLifeInDays: remainingShelfLife,
            published: webItem.published !== 0,
            modified: webItem.modified || matchedItem?.modified || new Date(),
            stock_uom: matchedItem?.stock_uom || webItem.stock_uom || 'Nos',
            variant_of: webItem.variant_of || '',
            has_variants: Boolean(webItem.has_variants),
            item_code: webItem.item_code || webItem.name,
            wholesale_pricing_tiers: wholesaleTiers,
            rating: { rate: 0, count: 0 }
          });
        });

        // Group variants and patch templates if needed (keeping original business logic)
        const variantsByTemplate = new Map<string, Product[]>();
        products.forEach(v => {
          let templateCode = v.variant_of;
          if (!templateCode && v.item_code) {
            const variantItemCode = v.item_code;
            const template = products.find(t => 
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
        products.forEach(p => {
          if (p.item_code && variantsByTemplate.has(p.item_code)) {
            const variants = variantsByTemplate.get(p.item_code)!;
            if (variants.length > 0) {
              variants.sort((a, b) => (a.price || 0) - (b.price || 0));
              const firstVariant = variants.find(v => v.price > 0) || variants[0];
              p.price = firstVariant.price;
              p.prevprice = firstVariant.prevprice;
              p.mrp = firstVariant.mrp;
              p.pack_size = firstVariant.pack_size;
            }
          }
        });

        // Fetch pricing rules and live warehouse stock, and overlay both onto the products
        // (pricing rules so cards can add-to-cart with correct tiered pricing just like the
        // product detail page does; stock so cards can show real warehouse balance qty).
        return forkJoin({
          slabMap: this.websiteItemService.getAllActivePricingRuleSlabs(),
          stockMap: this.websiteItemService.getAllItemStock().pipe(catchError(() => of(new Map<string, { warehouse: string; qty: number }[]>())))
        }).pipe(
          map(({ slabMap, stockMap }) => {
            return products.map(p => {
              const rules = slabMap.get(p.item_code || '') || [];
              const pricingRuleSlabs = this.resolvePricingRuleSlabs(rules, p.price);

              const stockByWarehouse = stockMap.get(p.item_code || '') || [];
              const stockQty = stockByWarehouse.reduce((sum, row) => sum + row.qty, 0);

              const badgeRule = rules
                .filter(r => r.minQty <= 1 && (r.discountPercentage > 0 || r.fixedPrice > 0 || r.discountAmount > 0))
                .sort((a, b) => b.discountPercentage - a.discountPercentage)[0];

              if (badgeRule) {
                const discounted = this.resolveSlabPrice(badgeRule, p.price);
                const discountPct = badgeRule.discountPercentage > 0
                  ? badgeRule.discountPercentage
                  : (p.price > 0 ? Math.round(((p.price - discounted) / p.price) * 100) : 0);
                return {
                  ...p,
                  erpDiscountedPrice: discounted,
                  erpDiscountPct: discountPct,
                  pricingRuleSlabs,
                  stockQty,
                  stockByWarehouse
                };
              }
              return { ...p, pricingRuleSlabs, stockQty, stockByWarehouse };
            }).filter(p => p.title && p.title.trim() !== '' && p.images && p.images.length > 0);
          }),
          catchError(() => of(products.filter(p => p.title && p.title.trim() !== '' && p.images && p.images.length > 0)))
        );
      }),
      catchError((error) => {
        console.error('Error fetching ERP products:', error);
        return of([]);
      })
    );
  }

  get get(): Observable<Product[]> {
    return this.fetchProductsFromERP();
  }

  getByCategory(category: string): Observable<Product[]> {
    const normalizedCategory = this.normalizeValue(category || '');
    const isAll = normalizedCategory === 'all item groups' || normalizedCategory === 'all' || !normalizedCategory;

    return this.fetchProductsFromERP().pipe(
      map((products) => {
        if (isAll) {
          return products;
        }
        return products.filter((item) => this.normalizeValue(item.category) === normalizedCategory);
      })
    );
  }

  getRelated(type: string): Observable<Product[]> {
    const normalizedType = this.normalizeValue(type || '');
    return this.fetchProductsFromERP().pipe(
      map((products) => {
        return products.filter((item) => this.normalizeValue(item.type) === normalizedType);
      })
    );
  }

  getProduct(id: any): Observable<Product> {
    const searchId = String(id || '');
    return this.fetchProductsFromERP().pipe(
      map((products) => {
        const product = products.find(p => String(p.id) === searchId || p.item_code === searchId);
        return product || {} as Product;
      })
    );
  }

  search(query: string): Observable<Product[]> {
    const normalizedQuery = this.normalizeValue(query || '');
    return this.fetchProductsFromERP().pipe(
      map((products) => {
        if (!normalizedQuery) {
          return products;
        }

        return products.filter((item) => {
          const title = this.normalizeValue(item.title);
          const description = this.normalizeValue(item.description);
          const category = this.normalizeValue(item.category);
          const type = this.normalizeValue(item.type);
          return title.includes(normalizedQuery) || description.includes(normalizedQuery) || category.includes(normalizedQuery) || type.includes(normalizedQuery);
        });
      })
    );
  }

  getRatingStar(product: Product) {
    this.ratingList = [];
    const rate = product?.rating?.rate ?? 0;
    [...Array(5)].map((_, index) => {
      return index + 1 <= Math.trunc(rate) ? this.ratingList.push(true) : this.ratingList.push(false);
    });
    return this.ratingList;
  }
}
