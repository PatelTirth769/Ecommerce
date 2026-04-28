import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from 'src/app/modules/product/model';

interface QuotationItemRecord extends Record<string, unknown> {
  name?: string;
  item_code?: string;
  item_name?: string;
  item_group?: string;
  brand?: string;
  description?: string;
  qty?: number;
  discount_amount?: number;
  discount_percentage?: number;
  price_list_rate?: number;
  rate?: number;
  amount?: number;
  net_amount?: number;
  stock_uom?: string;
  image?: string;
  website_image?: string;
  thumbnail?: string;
  idx?: number;
}

interface QuotationRecord extends Record<string, unknown> {
  name?: string;
  coupon_code?: string;
  items?: QuotationItemRecord[];
  grand_total?: number;
  net_total?: number;
  total?: number;
  rounded_total?: number;
  tax_amount?: number;
  total_taxes_and_charges?: number;
  shipping_rule_rate?: number;
  shipping_rule_amount?: number;
  shipping_charge?: number;
  shipping_charges?: number;
  total_shipping_charges?: number;
  discount_amount?: number;
  additional_discount_amount?: number;
  docstatus?: number;
  modified?: string;
}

interface QuotationListResponse {
  data: Array<{ name?: string }>;
}

interface QuotationDocResponse {
  data: QuotationRecord;
}

interface ERPMethodResponse<T = unknown> {
  message?: T;
}

interface ResourceListResponse<T = Record<string, unknown>> {
  data: T[];
}

interface ResourceDocResponse<T = Record<string, unknown>> {
  data: T;
}

interface CouponCodeRecord extends Record<string, unknown> {
  name?: string;
  coupon_name?: string;
  coupon_code?: string;
  pricing_rule?: string;
  pricing_rules?: Array<Record<string, unknown>>;
}

interface PricingRuleRecord extends Record<string, unknown> {
  name?: string;
  apply_on?: string;
  price_or_product_discount?: string;
  rate_or_discount?: string;
  rate?: number;
  discount_percentage?: number;
  discount_amount?: number;
  min_qty?: number;
  min_amt?: number;
  item_code?: string;
  item_group?: string;
  brand?: string;
  items?: Array<Record<string, unknown>>;
  pricing_rule_items?: Array<Record<string, unknown>>;
  item_codes?: Array<Record<string, unknown>>;
  item_groups?: Array<Record<string, unknown>>;
  brands?: Array<Record<string, unknown>>;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly quotationEndpoint = this.buildApiUrl('api/resource/Quotation');
  private readonly couponCodeEndpoint = this.buildApiUrl('api/resource/Coupon%20Code');
  private readonly pricingRuleEndpoint = this.buildApiUrl('api/resource/Pricing%20Rule');
  private readonly cartStorageKey = 'erpnext_active_quotation';
  private readonly cartImageCacheStorageKey = 'erpnext_cart_image_cache';
  private readonly applyCouponEndpoints = [
    this.buildApiUrl('api/method/erpnext.shopping_cart.cart.apply_coupon_code'),
    this.buildApiUrl('api/method/erpnext.e_commerce.shopping_cart.cart.apply_coupon_code')
  ];
  private readonly getCartQuotationEndpoints = [
    this.buildApiUrl('api/method/erpnext.shopping_cart.cart.get_cart_quotation'),
    this.buildApiUrl('api/method/erpnext.e_commerce.shopping_cart.cart.get_cart_quotation'),
    this.buildApiUrl('api/method/webshop.shopping_cart.cart.get_cart_quotation'),
    this.buildApiUrl('api/method/webshop.webshop.shopping_cart.cart.get_cart_quotation')
  ];
  private readonly updateCartEndpoints = [
    this.buildApiUrl('api/method/erpnext.shopping_cart.cart.update_cart'),
    this.buildApiUrl('api/method/erpnext.e_commerce.shopping_cart.cart.update_cart'),
    this.buildApiUrl('api/method/webshop.shopping_cart.cart.update_cart'),
    this.buildApiUrl('api/method/webshop.webshop.shopping_cart.cart.update_cart')
  ];
  private readonly ADMIN_TOKEN = 'token 764ae0b7b89ab0f:944d939f51e9336';
  private manualCouponRule: PricingRuleRecord | null = null;

  private cart: Product[] = [];
  private products = new BehaviorSubject<Product[]>(this.cart);
  /** Observable stream of cart products — components should subscribe to this */
  public cart$ = this.products.asObservable();
  public appliedCouponCode = new BehaviorSubject<string>('');
  public totalAmount=new BehaviorSubject<number>(0);
  public shippingAmount = new BehaviorSubject<number>(0);
  public discountAmount = new BehaviorSubject<number>(0);
  public gstAmount=new BehaviorSubject<number>(0);
  public estimatedTotal=new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    void this.loadCart().subscribe();
   }
  public get getCart(){
    return this.cart;
  }

  /**
   * Public method to force-refresh the cart from ERPNext.
   * Call this when navigating to the cart page to pick up
   * items added on the ERPNext webshop.
   */
  public refreshFromServer(): Observable<Product[]> {
    return this.loadCart();
  }

  private buildApiUrl(path: string): string {
    const base = environment.baseAPIURL || '';
    if (!base) {
      return path.startsWith('/') ? path : `/${path}`;
    }
    const baseUrl = base.endsWith('/') ? base : `${base}/`;
    const normalizedPath = baseUrl.endsWith('/api/') && path.startsWith('api/') ? path.substring(4) : path;
    return `${baseUrl}${normalizedPath}`;
  }

  private get adminHeaders(): { [key: string]: string } {
    return { 'Authorization': this.ADMIN_TOKEN };
  }

  private getCurrentUserEmail(): string {
    try {
      const stored = localStorage.getItem('erpnext_user');
      if (stored) {
        const user = JSON.parse(stored);
        return user?.email || user?.name || '';
      }
    } catch {}
    return '';
  }

  private getCartKey(product: Product): string {
    return String(product.item_code || product.type || product.id || product.title || '').trim().toLowerCase();
  }

  private getStoredQuotationName(): string | null {
    return localStorage.getItem(this.cartStorageKey);
  }

  private setStoredQuotationName(name: string | null): void {
    if (name) {
      localStorage.setItem(this.cartStorageKey, name);
      return;
    }

    localStorage.removeItem(this.cartStorageKey);
  }

  private createEmptyTotals(): void {
    this.appliedCouponCode.next('');
    this.totalAmount.next(0);
    this.shippingAmount.next(0);
    this.discountAmount.next(0);
    this.gstAmount.next(0);
    this.estimatedTotal.next(0);
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private getImageCache(): Record<string, string> {
    try {
      const raw = localStorage.getItem(this.cartImageCacheStorageKey);
      if (!raw) {
        return {};
      }

      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const result: Record<string, string> = {};

      Object.entries(parsed || {}).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim()) {
          result[key] = value;
        }
      });

      return result;
    } catch {
      return {};
    }
  }

  private setImageCache(cache: Record<string, string>): void {
    localStorage.setItem(this.cartImageCacheStorageKey, JSON.stringify(cache));
  }

  private cacheImageForKey(key: string, imageUrl: string): void {
    if (!key || !imageUrl) {
      return;
    }

    const cache = this.getImageCache();
    cache[key] = imageUrl;
    this.setImageCache(cache);
  }

  private getCachedImageForKey(key: string): string {
    if (!key) {
      return '';
    }

    const cache = this.getImageCache();
    return cache[key] || '';
  }

  private cacheProductImage(product: Product): void {
    const key = this.getCartKey(product);
    const imageUrl = product.images?.[0] || '';
    this.cacheImageForKey(key, imageUrl);
  }

  private firstFinite(...values: unknown[]): number {
    for (const value of values) {
      const num = Number(value);
      if (Number.isFinite(num)) {
        return num;
      }
    }

    return 0;
  }

  private resetManualCouponState(): void {
    this.manualCouponRule = null;
  }

  private updateTotalsFromQuotation(quotation: QuotationRecord, fallbackProducts: Product[]): void {
    const fallbackSubtotal = fallbackProducts.reduce((sum, item) => sum + this.toNumber(item.totalprice), 0);

    const netTotal = this.firstFinite(
      quotation.net_total,
      quotation.total,
      fallbackSubtotal
    );

    const gst = this.firstFinite(
      quotation.total_taxes_and_charges,
      quotation.tax_amount,
      fallbackSubtotal * 0.18
    );

    const shipping = this.firstFinite(
      quotation.shipping_rule_amount,
      quotation.total_shipping_charges,
      quotation.shipping_charge,
      quotation.shipping_charges,
      quotation.shipping_rule_rate,
      0
    );

    const discount = this.firstFinite(
      quotation.discount_amount,
      quotation.additional_discount_amount,
      0
    );

    const grandTotal = this.firstFinite(
      quotation.grand_total,
      quotation.rounded_total,
      netTotal + gst + shipping - discount
    );

    this.totalAmount.next(netTotal);
    this.gstAmount.next(gst);
    this.shippingAmount.next(shipping);
    this.discountAmount.next(discount);
    this.estimatedTotal.next(grandTotal);
    this.appliedCouponCode.next(String(quotation.coupon_code || '').trim());
    if (quotation.coupon_code) {
      this.resetManualCouponState();
    }
  }

  private collectRuleValues(rule: PricingRuleRecord, directField: string, tableField: string): string[] {
    const collected: string[] = [];
    const directValue = String(rule[directField] || '').trim();
    if (directValue) {
      collected.push(directValue.toLowerCase());
    }

    const rows = rule[tableField];
    if (Array.isArray(rows)) {
      rows.forEach((row) => {
        const value = String((row as Record<string, unknown>)[directField] || '').trim();
        if (value) {
          collected.push(value.toLowerCase());
        }
      });
    }

    return Array.from(new Set(collected));
  }

  private collectRuleValuesByCandidates(
    rule: PricingRuleRecord,
    directFields: string[],
    tableFields: string[],
    rowFields: string[]
  ): string[] {
    const values = new Set<string>();

    const addTokenizedValue = (raw: unknown): void => {
      const text = String(raw || '').trim().toLowerCase();
      if (!text) {
        return;
      }

      text
        .split(/[\n,]+/g)
        .map((token) => token.trim())
        .filter((token) => token.length > 0)
        .forEach((token) => values.add(token));
    };

    directFields.forEach((field) => {
      addTokenizedValue(rule[field]);
    });

    tableFields.forEach((tableField) => {
      const rows = rule[tableField];
      if (!Array.isArray(rows)) {
        return;
      }

      rows.forEach((row) => {
        const record = row as Record<string, unknown>;
        rowFields.forEach((rowField) => {
          addTokenizedValue(record[rowField]);
        });
      });
    });

    return Array.from(values);
  }

  private getFirstRuleNumber(rule: PricingRuleRecord, keys: string[]): number {
    for (const key of keys) {
      const raw = rule[key];
      const value = Number(raw);
      if (Number.isFinite(value)) {
        return value;
      }
    }

    return 0;
  }

  private getRuleMinimumQty(rule: PricingRuleRecord): number {
    return this.getFirstRuleNumber(rule, ['min_qty', 'minimum_qty', 'min_quantity']);
  }

  private getRuleMinimumAmount(rule: PricingRuleRecord): number {
    return this.getFirstRuleNumber(rule, ['min_amt', 'min_amount', 'minimum_amount']);
  }

  private getRuleDiscountPercentage(rule: PricingRuleRecord): number {
    return this.getFirstRuleNumber(rule, ['discount_percentage', 'for_discount_percentage', 'discount_percent', 'rate']);
  }

  private getRuleDiscountAmount(rule: PricingRuleRecord): number {
    return this.getFirstRuleNumber(rule, ['discount_amount', 'for_discount_amount', 'price_discount_amount']);
  }

  private getRuleRate(rule: PricingRuleRecord): number {
    return this.getFirstRuleNumber(rule, ['rate', 'price', 'for_price']);
  }

  private isPriceRuleMode(rule: PricingRuleRecord): boolean {
    const mode = String(rule.price_or_product_discount || '').trim().toLowerCase();
    return mode.includes('price');
  }

  private itemMatchesPricingRule(product: Product, rule: PricingRuleRecord): boolean {
    const applyOn = String(rule.apply_on || '').toLowerCase();
    if (!applyOn || applyOn.includes('transaction')) {
      return true;
    }

    if (applyOn.includes('item code') || applyOn === 'item') {
      const allowedCodes = this.collectRuleValuesByCandidates(
        rule,
        ['item_code', 'item', 'item_name'],
        ['item_codes', 'items', 'item_code_details', 'pricing_rule_items'],
        ['item_code', 'item', 'item_name']
      );
      if (!allowedCodes.length) {
        return true;
      }

      const productCode = String(product.item_code || product.type || product.title || '').trim().toLowerCase();
      return allowedCodes.includes(productCode);
    }

    if (applyOn.includes('item group')) {
      const allowedGroups = this.collectRuleValuesByCandidates(
        rule,
        ['item_group', 'item_group_name'],
        ['item_groups', 'items', 'pricing_rule_items'],
        ['item_group', 'item_group_name']
      );
      if (!allowedGroups.length) {
        return true;
      }

      return allowedGroups.includes(String(product.category || '').trim().toLowerCase());
    }

    if (applyOn.includes('brand')) {
      const allowedBrands = this.collectRuleValuesByCandidates(
        rule,
        ['brand', 'brand_name'],
        ['brands', 'items', 'pricing_rule_items'],
        ['brand', 'brand_name']
      );
      if (!allowedBrands.length) {
        return true;
      }

      return allowedBrands.includes(String(product.type || '').trim().toLowerCase());
    }

    return true;
  }

  private calculateDiscountForRuleAmount(
    matchingIndexes: number[],
    baseAmounts: number[],
    rule: PricingRuleRecord
  ): number[] {
    const discounts = new Array(baseAmounts.length).fill(0);
    const discountAmount = this.getRuleDiscountAmount(rule);
    if (discountAmount <= 0 || !matchingIndexes.length) {
      return discounts;
    }

    const applyOn = String(rule.apply_on || '').toLowerCase();
    if (applyOn.includes('transaction')) {
      const matchingTotal = matchingIndexes.reduce((sum, idx) => sum + baseAmounts[idx], 0);
      if (matchingTotal <= 0) {
        return discounts;
      }

      let remaining = discountAmount;
      matchingIndexes.forEach((idx, position) => {
        if (position === matchingIndexes.length - 1) {
          discounts[idx] = Math.max(Math.min(remaining, baseAmounts[idx]), 0);
          return;
        }

        const proportional = (baseAmounts[idx] / matchingTotal) * discountAmount;
        const bounded = Math.max(Math.min(proportional, baseAmounts[idx]), 0);
        discounts[idx] = bounded;
        remaining -= bounded;
      });

      return discounts;
    }

    matchingIndexes.forEach((idx) => {
      const qty = Number(this.cart[idx].qty ?? 1) || 1;
      discounts[idx] = Math.max(Math.min(discountAmount * qty, baseAmounts[idx]), 0);
    });
    return discounts;
  }

  private applyManualPricingRuleToCart(rule: PricingRuleRecord): void {
    this.manualCouponRule = rule;

    const minQty = this.getRuleMinimumQty(rule);
    const minAmount = this.getRuleMinimumAmount(rule);

    const baseAmounts = this.cart.map((item) => Number(item.price ?? 0) * (Number(item.qty ?? 1) || 1));
    const baseSubtotal = baseAmounts.reduce((sum, value) => sum + value, 0);
    const totalQty = this.cart.reduce((sum, item) => sum + (Number(item.qty ?? 1) || 1), 0);

    if ((minQty > 0 && totalQty < minQty) || (minAmount > 0 && baseSubtotal < minAmount)) {
      this.cart.forEach((item, index) => {
        item.discount = 0;
        item.totalprice = baseAmounts[index];
      });

      this.products.next(this.cart);
      this.totalAmount.next(baseSubtotal);
      this.discountAmount.next(0);
      const gst = baseSubtotal * 0.18;
      this.gstAmount.next(gst);
      this.shippingAmount.next(0);
      this.estimatedTotal.next(baseSubtotal + gst);
      return;
    }

    const matchingIndexes = this.cart
      .map((item, index) => (this.itemMatchesPricingRule(item, rule) ? index : -1))
      .filter((index) => index >= 0);

    const rateOrDiscount = String(rule.rate_or_discount || '').toLowerCase();
    const percentage = this.getRuleDiscountPercentage(rule);
    const amountDiscount = this.getRuleDiscountAmount(rule);
    const targetRate = this.getRuleRate(rule);
    const isPriceMode = this.isPriceRuleMode(rule);
    const fixedAmountDiscounts = this.calculateDiscountForRuleAmount(matchingIndexes, baseAmounts, rule);

    let totalDiscount = 0;
    this.cart.forEach((item, index) => {
      const base = baseAmounts[index];
      let itemDiscount = 0;

      if (matchingIndexes.includes(index)) {
        if (isPriceMode && (rateOrDiscount.includes('rate') || targetRate > 0)) {
          const qty = Number(item.qty ?? 1) || 1;
          const targetAmount = Math.max(targetRate * qty, 0);
          itemDiscount = Math.max(base - targetAmount, 0);
        } else if (percentage > 0 || rateOrDiscount.includes('percentage')) {
          itemDiscount = (base * percentage) / 100;
        } else if (amountDiscount > 0 || rateOrDiscount.includes('amount')) {
          itemDiscount = fixedAmountDiscounts[index] || 0;
        }
      }

      item.discount = Math.max(Math.min(itemDiscount, base), 0);
      item.totalprice = Math.max(base - (item.discount || 0), 0);
      totalDiscount += item.discount || 0;
    });

    const taxableAmount = Math.max(baseSubtotal - totalDiscount, 0);
    const gst = taxableAmount * 0.18;

    this.products.next(this.cart);
    this.totalAmount.next(baseSubtotal);
    this.discountAmount.next(totalDiscount);
    this.gstAmount.next(gst);
    this.shippingAmount.next(0);
    this.estimatedTotal.next(taxableAmount + gst);
  }

  private findCouponByCode(code: string): Observable<CouponCodeRecord | null> {
    const couponFields = ['name', 'coupon_name', 'coupon_code', 'pricing_rule'];
    const primaryParams = new HttpParams()
      .set('fields', JSON.stringify(couponFields))
      .set('filters', JSON.stringify([
        ['Coupon Code', 'coupon_name', '=', code]
      ]))
      .set('limit_page_length', '1');

    const codeParams = new HttpParams()
      .set('fields', JSON.stringify(couponFields))
      .set('filters', JSON.stringify([
        ['Coupon Code', 'coupon_code', '=', code]
      ]))
      .set('limit_page_length', '1');

    const fallbackParams = new HttpParams()
      .set('fields', JSON.stringify(couponFields))
      .set('filters', JSON.stringify([
        ['Coupon Code', 'name', '=', code]
      ]))
      .set('limit_page_length', '1');

    const candidateNames = [
      code,
      code.toLowerCase(),
      code.toUpperCase()
    ];

    return this.http
      .get<ResourceListResponse<CouponCodeRecord>>(this.couponCodeEndpoint, {
        params: primaryParams,
        withCredentials: true
      })
      .pipe(
        switchMap((response) => {
          const coupon = response?.data?.[0] || null;
          if (coupon) {
            const docName = String(coupon.name || '').trim();
            if (docName) {
              return this.fetchCouponByName(docName).pipe(map((doc) => doc || coupon));
            }
            return of(coupon);
          }

          return this.http
            .get<ResourceListResponse<CouponCodeRecord>>(this.couponCodeEndpoint, {
              params: codeParams,
              withCredentials: true
            })
            .pipe(
              switchMap((codeResponse) => {
                const codeCoupon = codeResponse?.data?.[0] || null;
                if (codeCoupon) {
                  const docName = String(codeCoupon.name || '').trim();
                  if (docName) {
                    return this.fetchCouponByName(docName).pipe(map((doc) => doc || codeCoupon));
                  }
                  return of(codeCoupon);
                }

                return this.http
                  .get<ResourceListResponse<CouponCodeRecord>>(this.couponCodeEndpoint, {
                    params: fallbackParams,
                    withCredentials: true
                  })
                  .pipe(
                    switchMap((fallbackResponse) => {
                      const fallbackCoupon = fallbackResponse?.data?.[0] || null;
                      if (fallbackCoupon) {
                        const docName = String(fallbackCoupon.name || '').trim();
                        if (docName) {
                          return this.fetchCouponByName(docName).pipe(map((doc) => doc || fallbackCoupon));
                        }
                        return of(fallbackCoupon);
                      }

                      return this.fetchCouponByAnyName(candidateNames);
                    })
                  );
              })
            );
        })
      );
  }

  private validateCouponRecord(code: string, coupon: CouponCodeRecord): string | null {
    if (!coupon) {
      return `Coupon ${code} not found.`;
    }

    const normalizedCode = code.trim().toLowerCase();
    const allowedCodes = [
      String(coupon.coupon_name || '').trim().toLowerCase(),
      String(coupon.coupon_code || '').trim().toLowerCase(),
      String(coupon.name || '').trim().toLowerCase()
    ].filter((value) => value.length > 0);

    if (allowedCodes.length && !allowedCodes.includes(normalizedCode)) {
      return 'Invalid coupon code.';
    }

    if (!this.getPricingRuleNameFromCoupon(coupon)) {
      return 'No pricing rule linked with this coupon.';
    }

    return null;
  }

  private fetchPricingRule(name: string): Observable<PricingRuleRecord> {
    return this.http
      .get<ResourceDocResponse<PricingRuleRecord>>(`${this.pricingRuleEndpoint}/${encodeURIComponent(name)}`, {
        withCredentials: true
      })
      .pipe(map((response) => response?.data || {}));
  }

  private applyCouponUsingResourceApis(code: string): Observable<{ success: boolean; message: string; discountAmount: number }> {
    return this.findCouponByCode(code)
      .pipe(
        switchMap((coupon) => {
          const validationMessage = this.validateCouponRecord(code, coupon || {});
          if (validationMessage) {
            return of({ success: false, message: validationMessage, discountAmount: this.discountAmount.value });
          }

          const pricingRuleName = this.getPricingRuleNameFromCoupon(coupon || {});
          return this.fetchPricingRule(pricingRuleName)
            .pipe(
              map((rule) => {
                this.appliedCouponCode.next(code);
                this.applyManualPricingRuleToCart(rule || {});

                if (this.discountAmount.value <= 0) {
                  return {
                    success: false,
                    message: `Coupon ${code} is valid, but no discount applies to current cart items.`,
                    discountAmount: this.discountAmount.value
                  };
                }

                return {
                  success: true,
                  message: `Coupon ${code} applied from Pricing Rule ${pricingRuleName}.`,
                  discountAmount: this.discountAmount.value
                };
              }),
              catchError(() => of({
                success: false,
                message: `Unable to load Pricing Rule ${pricingRuleName}.`,
                discountAmount: this.discountAmount.value
              }))
            );
        }),
        catchError((error) => of({
          success: false,
          message: this.getReadableERPError(error),
          discountAmount: this.discountAmount.value
        }))
      );
  }

  private resolveImageSource(item: QuotationItemRecord, fallbackKey: string): string {
    const fallbackImage = 'assets/images/logo.png';
    const image = item.image || item.website_image || item.thumbnail || this.getCachedImageForKey(fallbackKey);
    if (!image || typeof image !== 'string') {
      return fallbackImage;
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    if (image.includes('/files/') || image.includes('/private/')) {
      return image.startsWith('/') ? image : `/${image}`;
    }

    const path = image.startsWith('/') ? image : `/files/${image}`;
    return path;
  }

  private mapQuotationItemToProduct(item: QuotationItemRecord, index: number): Product {
    const qty = Number(item.qty ?? 1) || 1;
    const rate = Number(item.rate ?? item.amount ?? 0) || 0;
    const amount = Number(item.amount ?? rate * qty) || 0;
    const discountAmount = Number(item.discount_amount ?? 0) || 0;
    const priceListRate = Number(item.price_list_rate ?? rate) || rate;
    const effectiveDiscount = discountAmount > 0 ? discountAmount : Math.max((priceListRate - rate) * qty, 0);
    const itemCode = String(item.item_code || item.item_name || item.name || `item-${index + 1}`);
    const normalizedKey = itemCode.trim().toLowerCase();
    const resolvedImage = this.resolveImageSource(item, normalizedKey);
    this.cacheImageForKey(normalizedKey, resolvedImage);

    return {
      id: Number(item.idx ?? index + 1),
      title: item.item_name || item.item_code || itemCode,
      description: item.description ? String(item.description) : '',
      category: String(item.item_group || ''),
      type: item.item_code || item.item_name || itemCode,
      sizes: [],
      images: [resolvedImage],
      stock: 'In cart',
      price: rate,
      prevprice: rate,
      qty,
      discount: effectiveDiscount,
      totalprice: amount,
      item_code: item.item_code || itemCode,
      rating: {
        rate: 0,
        count: 0
      }
    };
  }

  private syncCart(products: Product[]): void {
    this.cart.splice(0, this.cart.length, ...products);
    this.products.next(this.cart);
  }

  private normalizeQuotationItems(items: Product[]): QuotationItemRecord[] {
    return items.map((product, index) => ({
      idx: index + 1,
      item_code: product.item_code || product.type || product.title,
      item_name: product.title,
      description: product.description,
      qty: product.qty ?? 1,
      rate: Number(product.price ?? 0),
      amount: Number((product.totalprice ?? product.price ?? 0)),
      image: product.images?.[0],
      stock_uom: 'Nos'
    }));
  }

  /**
   * Persist the current local cart state to ERPNext as a Quotation document.
   * Uses REST API (PUT /api/resource/Quotation/{name}) for maximum compatibility.
   */
  private persistCartToQuotation(): Observable<Product[]> {
    const quotationName = this.getStoredQuotationName();
    const items = this.normalizeQuotationItems(this.cart);

    if (quotationName) {
      return this.http.put<QuotationDocResponse>(
        `${this.quotationEndpoint}/${encodeURIComponent(quotationName)}`,
        { items: items },
        { headers: this.adminHeaders }
      ).pipe(
        map(res => {
          const q = res?.data;
          const mapped = (q?.items || []).map((item: any, i: number) => this.mapQuotationItemToProduct(item, i));
          this.updateTotalsFromQuotation(q || {}, mapped);
          return mapped;
        }),
        tap(products => this.syncCart(products)),
        catchError(err => {
          console.warn('Failed to update Quotation, trying to create new:', err);
          // Quotation may have been submitted/cancelled - create a new one
          this.setStoredQuotationName(null);
          return this.createQuotationWithItems(items);
        })
      );
    }

    // No existing quotation - create a new one
    if (items.length > 0) {
      return this.createQuotationWithItems(items);
    }
    return of(this.cart);
  }

  /**
   * Create a new Draft Quotation with the given items.
   */
  private createQuotationWithItems(items: QuotationItemRecord[]): Observable<Product[]> {
    const userEmail = this.getCurrentUserEmail();
    const payload: any = {
      order_type: 'Shopping Cart',
      docstatus: 0,
      items: items
    };
    if (userEmail) {
      payload.contact_email = userEmail;
    }

    return this.http.post<QuotationDocResponse>(
      this.quotationEndpoint,
      payload,
      { headers: this.adminHeaders }
    ).pipe(
      map(res => {
        const q = res?.data;
        if (q?.name) {
          this.setStoredQuotationName(q.name);
        }
        const mapped = (q?.items || []).map((item: any, i: number) => this.mapQuotationItemToProduct(item, i));
        this.updateTotalsFromQuotation(q || {}, mapped);
        return mapped;
      }),
      tap(products => this.syncCart(products)),
      catchError(err => {
        console.error('Failed to create Quotation:', err);
        return of(this.cart);
      })
    );
  }

  loadCart(): Observable<Product[]> {
    return this.refreshCartFromMethodApi().pipe(
      switchMap(products => {
        if (products.length > 0) {
          return of(products);
        }
        // Fallback to REST if RPC returns empty (or failed)
        return this.fetchLatestDraftQuotation();
      }),
      tap(products => this.syncCart(products))
    );
  }

  private refreshCartFromMethodApi(): Observable<Product[]> {
    return this.postWithFallback(this.getCartQuotationEndpoints, {})
      .pipe(
        map((response) => {
          const quotation = this.extractQuotationFromMethodResponse(response);
          const items = Array.isArray(quotation.items) ? quotation.items : [];
          const mappedItems = items.map((item, index) => this.mapQuotationItemToProduct(item, index));
          this.updateTotalsFromQuotation(quotation, mappedItems);
          return mappedItems;
        }),
        catchError((error) => {
          console.warn('ERPNext Method Cart Load Failed (Expected if Shopping Cart disabled):', error);
          return of([] as Product[]);
        })
      );
  }

  private updateCartMethodApi(itemCode: string, qty: number): Observable<Product[]> {
    const formData = new FormData();
    formData.append('item_code', itemCode);
    formData.append('qty', String(qty));
    formData.append('with_items', '1');

    return this.postWithFallback(this.updateCartEndpoints, formData as any)
      .pipe(
        map((response) => {
          const quotation = this.extractQuotationFromMethodResponse(response);
          const items = Array.isArray(quotation.items) ? quotation.items : [];
          const mappedItems = items.map((item, index) => this.mapQuotationItemToProduct(item, index));
          this.updateTotalsFromQuotation(quotation, mappedItems);
          return mappedItems;
        }),
        tap(products => this.syncCart(products)),
        catchError(error => {
          console.error('ERPNext Method Cart Update Failed:', error);
          // Fallback to REST persistence if RPC fails
          return this.persistCartToQuotation();
        })
      );
  }

  private fetchLatestDraftQuotation(): Observable<Product[]> {
    const userEmail = this.getCurrentUserEmail();
    console.log('[Cart] Fetching draft quotation for user:', userEmail);

    const filterSets: any[][] = [];

    if (userEmail && userEmail !== 'Administrator') {
      // FOR REGULAR USERS: Only show THEIR cart
      // Strategy 1: Filter by contact_email
      filterSets.push([
        ['Quotation', 'docstatus', '=', 0],
        ['Quotation', 'order_type', '=', 'Shopping Cart'],
        ['Quotation', 'contact_email', '=', userEmail]
      ]);
      // Strategy 2: Filter by owner
      filterSets.push([
        ['Quotation', 'docstatus', '=', 0],
        ['Quotation', 'order_type', '=', 'Shopping Cart'],
        ['Quotation', 'owner', '=', userEmail]
      ]);
    } else if (userEmail === 'Administrator') {
      // FOR ADMINISTRATOR: Can see the latest overall cart for debugging
      filterSets.push([
        ['Quotation', 'docstatus', '=', 0],
        ['Quotation', 'order_type', '=', 'Shopping Cart']
      ]);
      filterSets.push([
        ['Quotation', 'docstatus', '=', 0]
      ]);
    } else {
      // GUEST: No server cart sync via REST
      return of([] as Product[]);
    }

    return this.tryQuotationFilters(filterSets, 0);
  }

  private tryQuotationFilters(filterSets: any[][], index: number): Observable<Product[]> {
    if (index >= filterSets.length) {
      console.log('[Cart] No quotation found with any filter strategy.');
      this.setStoredQuotationName(null);
      this.createEmptyTotals();
      return of([] as Product[]);
    }

    const filters = filterSets[index];
    const params = new HttpParams()
      .set('fields', JSON.stringify(['name', 'contact_email', 'owner', 'order_type']))
      .set('filters', JSON.stringify(filters))
      .set('order_by', 'modified desc')
      .set('limit_page_length', '1');

    return this.http
      .get<any>(this.quotationEndpoint, {
        params,
        headers: this.adminHeaders
      })
      .pipe(
        switchMap((response) => {
          const quotationData = response?.data?.[0];
          if (quotationData?.name) {
            console.log(`[Cart] Found quotation with filter strategy ${index + 1}:`, quotationData);
            this.setStoredQuotationName(quotationData.name);
            return this.fetchQuotation(quotationData.name);
          }
          // Try next filter strategy
          console.log(`[Cart] No result with filter strategy ${index + 1}, trying next...`);
          return this.tryQuotationFilters(filterSets, index + 1);
        }),
        catchError((err) => {
          console.warn(`[Cart] Filter strategy ${index + 1} error:`, err);
          return this.tryQuotationFilters(filterSets, index + 1);
        })
      );
  }

  private fetchQuotation(name: string): Observable<Product[]> {
    return this.http
      .get<QuotationDocResponse>(`${this.quotationEndpoint}/${encodeURIComponent(name)}`, {
        headers: this.adminHeaders
      })
      .pipe(
        map((response) => {
          const quotation = response?.data;
          const items = Array.isArray(quotation?.items) ? quotation.items : [];
          const mappedItems = items.map((item, index) => this.mapQuotationItemToProduct(item, index));
          if (this.manualCouponRule) {
            this.syncCart(mappedItems);
            this.applyManualPricingRuleToCart(this.manualCouponRule);
          } else {
            this.updateTotalsFromQuotation(quotation || {}, mappedItems);
          }
          return mappedItems;
        }),
        catchError(() => of([] as Product[]))
      );
  }

  private extractQuotationFromMethodResponse(response: ERPMethodResponse<unknown>): QuotationRecord {
    const message = response?.message;
    if (!message || typeof message !== 'object') {
      return {};
    }

    if ('quotation' in (message as Record<string, unknown>)) {
      const quotation = (message as Record<string, unknown>)['quotation'];
      if (quotation && typeof quotation === 'object') {
        return quotation as QuotationRecord;
      }
    }

    return message as QuotationRecord;
  }

  private isMethodNotFoundError(error: unknown): boolean {
    const httpError = error as Record<string, unknown>;
    const status = Number(httpError?.['status']);
    const errorPayload = (httpError?.['error'] || {}) as Record<string, unknown>;
    const rawMessage = String(
      errorPayload['message']
      || errorPayload['_server_messages']
      || httpError?.['message']
      || ''
    ).toLowerCase();

    // 404 is the standard "Not Found" status
    if (status === 404) return true;

    // 417 is "Expectation Failed", often used by Frappe for validation errors.
    // We only treat it as "Method Not Found" if the message explicitly says so.
    if (status === 417 || status === 403) {
      return (
        rawMessage.includes('failed to get method') || 
        rawMessage.includes('no module named') ||
        rawMessage.includes('not found') ||
        rawMessage.includes('not allowed')
      );
    }

    return false;
  }

  private postWithFallback(
    endpoints: string[],
    body: Record<string, unknown>,
    index = 0,
    lastError: unknown = null
  ): Observable<ERPMethodResponse<unknown>> {
    if (index >= endpoints.length) {
      return throwError(() => (lastError || new Error('No valid ERPNext method endpoint found.')));
    }

    return this.http
      .post<ERPMethodResponse<unknown>>(endpoints[index], body, {
        withCredentials: true
      })
      .pipe(
        catchError((error) => {
          if (this.isMethodNotFoundError(error)) {
            return this.postWithFallback(endpoints, body, index + 1, error);
          }
          return throwError(() => error);
        })
      );
  }

  private getPricingRuleNameFromCoupon(coupon: CouponCodeRecord): string {
    const directCandidates = [
      coupon.pricing_rule,
      coupon['pricing_rule_name'],
      coupon['price_rule'],
      coupon['rule']
    ];

    for (const candidate of directCandidates) {
      const value = String(candidate || '').trim();
      if (value) {
        return value;
      }
    }

    const childTables = [
      coupon.pricing_rules,
      coupon['pricing_rule_details'],
      coupon['rules']
    ];

    for (const table of childTables) {
      if (!Array.isArray(table)) {
        continue;
      }

      for (const row of table) {
        const record = row as Record<string, unknown>;
        const rowCandidates = [
          record['pricing_rule'],
          record['pricing_rule_name'],
          record['rule'],
          record['price_rule']
        ];

        for (const rowCandidate of rowCandidates) {
          const value = String(rowCandidate || '').trim();
          if (value) {
            return value;
          }
        }
      }
    }

    return '';
  }

  private fetchCouponByName(name: string): Observable<CouponCodeRecord | null> {
    const normalized = String(name || '').trim();
    if (!normalized) {
      return of(null);
    }

    return this.http
      .get<ResourceDocResponse<CouponCodeRecord>>(`${this.couponCodeEndpoint}/${encodeURIComponent(normalized)}`, {
        withCredentials: true
      })
      .pipe(
        map((response) => response?.data || null),
        catchError(() => of(null))
      );
  }

  private fetchCouponByAnyName(candidates: string[]): Observable<CouponCodeRecord | null> {
    const unique = Array.from(new Set(candidates.map((value) => String(value || '').trim()).filter((value) => value.length > 0)));
    if (!unique.length) {
      return of(null);
    }

    const [current, ...rest] = unique;
    return this.fetchCouponByName(current).pipe(
      switchMap((coupon) => {
        if (coupon) {
          return of(coupon);
        }
        return this.fetchCouponByAnyName(rest);
      })
    );
  }

  private decodeServerMessagePayload(raw: unknown): string {
    const source = String(raw || '').trim();
    if (!source) {
      return '';
    }

    try {
      const parsed = JSON.parse(source) as unknown;
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return source;
      }

      const first = parsed[0];
      if (typeof first === 'string') {
        const nested = JSON.parse(first) as Record<string, unknown>;
        return String(nested['message'] || source);
      }

      if (first && typeof first === 'object') {
        return String((first as Record<string, unknown>)['message'] || source);
      }

      return source;
    } catch {
      return source;
    }
  }

  private getReadableERPError(error: unknown): string {
    const httpError = error as Record<string, unknown>;
    const payload = (httpError?.['error'] || {}) as Record<string, unknown>;
    const serverMessages = this.decodeServerMessagePayload(payload['_server_messages']);
    const message = String(payload['message'] || httpError?.['message'] || '').trim();

    if (serverMessages) {
      return serverMessages;
    }

    if (message) {
      return message;
    }

    return 'Unable to apply coupon. Please try again.';
  }


  public applyCoupon(code: string): Observable<{ success: boolean; message: string; discountAmount: number }> {
    const trimmedCode = String(code || '').trim();
    if (!trimmedCode) {
      return of({ success: false, message: 'Please enter a coupon code.', discountAmount: this.discountAmount.value });
    }

    return this.applyCouponUsingResourceApis(trimmedCode);
  }

  public add(product:Product){
    const key = this.getCartKey(product);
    const index = this.cart.findIndex((item) => this.getCartKey(item) === key);
    const itemCode = product.item_code || product.type || product.title || '';
    
    // Optimistic local update
    if (index >= 0) {
      this.cart[index].qty = (this.cart[index].qty || 1) + 1;
      this.cart[index].totalprice = this.cart[index].price * (this.cart[index].qty || 1);
    } else {
      const nextProduct = { ...product, qty: 1, totalprice: Number(product.price ?? 0) } as Product;
      this.cart.push(nextProduct);
    }
    
    this.products.next(this.cart);
    this.getTotal();

    const newQty = index >= 0 ? this.cart[index].qty : 1;
    this.updateCartMethodApi(itemCode, newQty || 1).subscribe();
  }

  public remove(product:Product){
    const key = this.getCartKey(product);
    const index = this.cart.findIndex((item) => this.getCartKey(item) === key);
    const itemCode = product.item_code || product.type || product.title || '';
    
    // Optimistic local update
    if (index >= 0) {
      this.cart.splice(index, 1);
      this.products.next(this.cart);
      this.getTotal();
    }

    this.updateCartMethodApi(itemCode, 0).subscribe();
  }

  updateQtyAndTotalPrice(item:Product){
    const index=this.find(item);
    const products=this.getCart;
    let totalQty=products[index].qty=1;
    totalQty=totalQty;
    let subTotal=products[index].price*totalQty;
    products[index].totalprice=subTotal;
  }
  find(item:Product):number{
    const products=this.getCart;
    const index= products.findIndex((prod)=>{ 
      return this.getCartKey(prod) === this.getCartKey(item);
    })
    return index;
  }
  getTotal():number{
    if (this.manualCouponRule) {
      this.applyManualPricingRuleToCart(this.manualCouponRule);
      return this.totalAmount.value;
    }

    const total=this.cart.reduce((r:any,c:any)=>r=r+c.totalprice,0);
    const gstRate=0.18;
    this.totalAmount.next(total);
    this.gstAmount.next(gstRate*total);
    this.shippingAmount.next(0);
    this.discountAmount.next(0);
    this.estimatedTotal.next(total+this.gstAmount.value);
    return total;
  }
  addQty(item:Product){
    const index = this.find(item);
    if (index < 0) return;
    
    const totalQty = (this.cart[index].qty || 1) + 1;
    if (totalQty <= 12) {
      this.cart[index].qty = totalQty;
      this.cart[index].totalprice = this.cart[index].price * totalQty;
      this.products.next(this.cart);
      this.getTotal();
      
      const itemCode = item.item_code || item.type || item.title || '';
      this.updateCartMethodApi(itemCode, totalQty).subscribe();
    }
  }

  lessQty(item:Product){
    const index = this.find(item);
    if (index < 0) return;

    const totalQty = (this.cart[index].qty || 1) - 1;
    if (totalQty >= 1) {
      this.cart[index].qty = totalQty;
      this.cart[index].totalprice = this.cart[index].price * totalQty;
      this.products.next(this.cart);
      this.getTotal();

      const itemCode = item.item_code || item.type || item.title || '';
      this.updateCartMethodApi(itemCode, totalQty).subscribe();
    }
  }
  public clearCart(): void {
    // For bidirectional sync, we should ideally remove all items from server cart
    // But as a quick fix, we just clear local state. 
    // To truly clear the ERPNext cart session-wide, we'd need a clear_cart method or loop update_cart.
    this.cart = [];
    this.products.next(this.cart);
    this.createEmptyTotals();
    this.setStoredQuotationName(null);
    this.resetManualCouponState();
  }
  
}
