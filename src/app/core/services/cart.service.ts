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
  private readonly removedCartKeysStorageKey = 'erpnext_removed_cart_keys';
  private readonly cartImageCacheStorageKey = 'erpnext_cart_image_cache';
  private readonly applyCouponEndpoints = [
    this.buildApiUrl('api/method/erpnext.shopping_cart.cart.apply_coupon_code'),
    this.buildApiUrl('api/method/erpnext.e_commerce.shopping_cart.cart.apply_coupon_code')
  ];
  private readonly getCartQuotationEndpoints = [
    this.buildApiUrl('api/method/erpnext.shopping_cart.cart.get_cart_quotation'),
    this.buildApiUrl('api/method/erpnext.e_commerce.shopping_cart.cart.get_cart_quotation')
  ];
  private manualCouponRule: PricingRuleRecord | null = null;

  private cart: Product[] = [];
  private products = new BehaviorSubject<Product[]>(this.cart);
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

  private buildApiUrl(path: string): string {
    const baseUrl = environment.baseAPIURL.endsWith('/') ? environment.baseAPIURL : `${environment.baseAPIURL}/`;
    const normalizedPath = baseUrl.endsWith('/api/') && path.startsWith('api/') ? path.substring(4) : path;
    return `${baseUrl}${normalizedPath}`;
  }

  private getCartKey(product: Product): string {
    return String(product.item_code || product.type || product.id || product.title || '').trim().toLowerCase();
  }

  private getStoredQuotationName(): string | null {
    return localStorage.getItem(this.cartStorageKey);
  }

  private getRemovedCartKeys(): Set<string> {
    try {
      const raw = localStorage.getItem(this.removedCartKeysStorageKey);
      if (!raw) {
        return new Set<string>();
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return new Set<string>();
      }

      return new Set<string>(parsed.map((value) => String(value).trim().toLowerCase()).filter((value) => value.length > 0));
    } catch {
      return new Set<string>();
    }
  }

  private setRemovedCartKeys(keys: Set<string>): void {
    localStorage.setItem(this.removedCartKeysStorageKey, JSON.stringify(Array.from(keys)));
  }

  private markRemovedCartKey(key: string): void {
    const keys = this.getRemovedCartKeys();
    keys.add(key);
    this.setRemovedCartKeys(keys);
  }

  private clearRemovedCartKey(key: string): void {
    const keys = this.getRemovedCartKeys();
    if (!keys.has(key)) {
      return;
    }

    keys.delete(key);
    this.setRemovedCartKeys(keys);
  }

  private isRemovedCartKey(key: string): boolean {
    return this.getRemovedCartKeys().has(key);
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

    return image.startsWith('/') ? image : `/files/${image}`;
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

  private persistCart(products: Product[]): Observable<void> {
    const quotationName = this.getStoredQuotationName();
    const payload = {
      items: this.normalizeQuotationItems(products)
    };

    if (!quotationName) {
      return of(void 0);
    }

    return this.http
      .put<QuotationDocResponse>(`${this.quotationEndpoint}/${encodeURIComponent(quotationName)}`, payload, {
        withCredentials: true
      })
      .pipe(
        tap((response) => {
          if (response?.data?.name) {
            this.setStoredQuotationName(response.data.name);
          }

          if (response?.data) {
            const quotationItems = Array.isArray(response.data.items) ? response.data.items : [];
            const mapped = quotationItems.map((item, index) => this.mapQuotationItemToProduct(item, index));
            this.syncCart(mapped);
            if (this.manualCouponRule) {
              this.applyManualPricingRuleToCart(this.manualCouponRule);
            } else {
              this.updateTotalsFromQuotation(response.data, mapped);
            }
          } else {
            this.getTotal();
          }
        }),
        map(() => void 0),
        catchError((error) => {
          console.warn('Could not sync cart quotation:', error);
          this.getTotal();
          return of(void 0);
        })
      );
  }

  loadCart(): Observable<Product[]> {
    const quotationName = this.getStoredQuotationName();

    if (quotationName) {
      return this.fetchQuotation(quotationName).pipe(
        catchError(() => this.fetchLatestDraftQuotation()),
        tap((products) => this.syncCart(products))
      );
    }

    return this.fetchLatestDraftQuotation().pipe(tap((products) => this.syncCart(products)));
  }

  private fetchLatestDraftQuotation(): Observable<Product[]> {
    const params = new HttpParams()
      .set('fields', JSON.stringify(['name']))
      .set('filters', JSON.stringify([['Quotation', 'docstatus', '=', 0]]))
      .set('order_by', 'modified desc')
      .set('limit_page_length', '1');

    return this.http
      .get<QuotationListResponse>(this.quotationEndpoint, {
        params,
        withCredentials: true
      })
      .pipe(
        map((response) => response?.data?.[0]?.name || ''),
        switchMap((quotationName) => {
          if (!quotationName) {
            this.setStoredQuotationName(null);
            this.createEmptyTotals();
            return of([] as Product[]);
          }

          this.setStoredQuotationName(quotationName);
          return this.fetchQuotation(quotationName);
        }),
        catchError(() => {
          this.createEmptyTotals();
          return of([] as Product[]);
        })
      );
  }

  private fetchQuotation(name: string): Observable<Product[]> {
    return this.http
      .get<QuotationDocResponse>(`${this.quotationEndpoint}/${encodeURIComponent(name)}`, {
        withCredentials: true
      })
      .pipe(
        map((response) => {
          const quotation = response?.data;
          const items = Array.isArray(quotation?.items) ? quotation.items : [];
          const mappedItems = items.map((item, index) => this.mapQuotationItemToProduct(item, index));
          const filteredItems = mappedItems.filter((item) => !this.isRemovedCartKey(this.getCartKey(item)));
          if (this.manualCouponRule) {
            this.syncCart(filteredItems);
            this.applyManualPricingRuleToCart(this.manualCouponRule);
          } else {
            this.updateTotalsFromQuotation(quotation || {}, filteredItems);
          }
          return filteredItems;
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

    if (rawMessage.includes('failed to get method for command') || rawMessage.includes('no module named')) {
      return true;
    }

    return status === 404 || status === 417;
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

  private refreshCartFromMethodApi(): Observable<Product[]> {
    return this.postWithFallback(this.getCartQuotationEndpoints, {})
      .pipe(
        map((response) => {
          const quotation = this.extractQuotationFromMethodResponse(response);
          const items = Array.isArray(quotation.items) ? quotation.items : [];
          const mappedItems = items.map((item, index) => this.mapQuotationItemToProduct(item, index));
          const filteredItems = mappedItems.filter((item) => !this.isRemovedCartKey(this.getCartKey(item)));
          this.updateTotalsFromQuotation(quotation, filteredItems);
          return filteredItems;
        }),
        tap((products) => this.syncCart(products)),
        catchError(() => {
          const fallbackTotal = this.getTotal();
          this.discountAmount.next(0);
          this.estimatedTotal.next(fallbackTotal + this.gstAmount.value);
          return of(this.cart);
        })
      );
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
    this.clearRemovedCartKey(key);
    const index = this.cart.findIndex((item) => this.getCartKey(item) === key);

    if (index >= 0) {
      this.cart[index].qty = (this.cart[index].qty || 1) + 1;
      this.cart[index].totalprice = this.cart[index].price * (this.cart[index].qty || 1);
      this.cacheProductImage(this.cart[index]);
    } else {
      const nextProduct = {
        ...product,
        qty: 1,
        totalprice: Number(product.price ?? 0)
      } as Product;
      this.cart.push(nextProduct);
      this.cacheProductImage(nextProduct);
    }

    this.products.next(this.cart);
    this.getTotal();
    void this.persistCart(this.cart).subscribe();
  }

  public remove(product:Product){
    const key = this.getCartKey(product);
    this.markRemovedCartKey(key);
    const index = this.cart.findIndex((item) => this.getCartKey(item) === key);

    if (index >= 0) {
      this.cart.splice(index,1);
    }

    this.products.next(this.cart);
    this.getTotal();
    void this.persistCart(this.cart).subscribe();
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
    const products=this.getCart;
    let index=this.find(item);
    if (index < 0) {
      return;
    }
    let totalQty=products[index].qty;
    if(totalQty!==12){
      totalQty=totalQty&&totalQty+1;
    }
    products[index].qty=totalQty;
    let subTotal=products[index].price*totalQty!;
    products[index].totalprice=subTotal;
    this.products.next(this.cart);
    this.getTotal();
    void this.persistCart(this.cart).subscribe();

  }
  lessQty(item:Product){
    const products=this.getCart;
    let index=this.find(item);
    if (index < 0) {
      return;
    }
    let totalQty=products[index].qty;
    if(totalQty!==1){
      totalQty=totalQty&&totalQty-1;
    }
    products[index].qty=totalQty;
    let subTotal=products[index].price*totalQty!;
    products[index].totalprice=subTotal;
    this.products.next(this.cart);
    this.getTotal();
    void this.persistCart(this.cart).subscribe();
  }
  
}
