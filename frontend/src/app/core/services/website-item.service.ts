import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface WebsiteItem {
  name: string;
  item_name?: string;
  item_code?: string;
  web_item_name?: string;
  web_long_description?: string;
  route?: string;
  website_image?: string;
  thumbnail?: string;
  description?: string;
  published?: number;
  modified?: string;
}

export interface ItemRecord {
  name: string;
  item_name?: string;
  item_code?: string;
  item_group?: string;
  stock_uom?: string;
  brand?: string;
  description?: string;
  image?: string;
  website_image?: string;
  thumbnail?: string;
  standard_rate?: number;
  disabled?: number;
  has_variants?: number;
  variant_of?: string;
  published?: number;
  modified?: string;
  creation?: string;
  custom_pack_size_?: string;
  custom_mrp?: number;
  shelf_life_in_days?: number;
  published_in_website?: number;
  custom_wholesale_pricing?: any[];
}

interface WebsiteItemListResponse {
  data: WebsiteItem[];
}

interface WebsiteItemResponse {
  data: WebsiteItem;
}

interface ItemResponse {
  data: ItemRecord;
}

interface NameOnlyRecord {
  name: string;
}

interface GenericListResponse {
  data: NameOnlyRecord[];
}

interface GenericDocResponse {
  data: Record<string, unknown>;
}

interface ItemPriceListResponse {
  data: Array<{
    name?: string;
    item_code?: string;
    price_list_rate?: number;
    currency?: string;
    price_list?: string;
  }>;
}

export interface PricingRuleSlab {
  name: string;
  title: string;
  minQty: number;
  maxQty: number;
  discountPercentage: number;
  discountAmount: number;
  fixedPrice: number;
  uom: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsiteItemService {
  private readonly endpoint = this.buildApiUrl(environment.websiteItemEndpoint);
  private readonly itemEndpoint = this.buildApiUrl('api/resource/Item');
  private readonly itemPriceEndpoint = this.buildApiUrl('api/resource/Item%20Price');
  private readonly itemReviewEndpoint = this.buildApiUrl('api/resource/Item Review');

  private readonly websiteItemFields = JSON.stringify([
    'name',
    'item_name',
    'item_code',
    'web_item_name',
    'web_long_description',
    'route',
    'website_image',
    'thumbnail',
    'description',
    'published',
    'modified'
  ]);

  private readonly itemFields = JSON.stringify([
    'name',
    'item_name',
    'item_code',
    'item_group',
    'stock_uom',
    'brand',
    'description',
    'image',
    'standard_rate',
    'disabled',
    'has_variants',
    'variant_of',
    'modified',
    'creation',
    'custom_mrp',
    'custom_pack_size_',
    'shelf_life_in_days',
    'published_in_website'
  ]);

  // REPLACE THESE WITH YOUR ACTUAL ADMIN KEYS FROM ERPNEXT
  private readonly API_KEY = '764ae0b7b89ab0f';
  private readonly API_SECRET = 'c69b450d20ffcf2';

  constructor(private http: HttpClient) {}

  private get authHeaders(): { [header: string]: string } {
    return {
      'Authorization': `token ${this.API_KEY}:${this.API_SECRET}`
    };
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

  private normalizeLookupValue(value: string): string {
    return value.trim().replace(/^\//, '').toLowerCase();
  }

  private stripVersionSuffix(value: string): string {
    // Remove version suffix like :1, :2, etc. that might come from routing
    return value.replace(/:\d+$/, '').trim();
  }

  resolveImageUrl(value: string): string {
    if (!value) {
      return 'assets/images/logo.png';
    }

    if (value.startsWith('assets/') || value.startsWith('/assets/')) {
      return value.startsWith('/') ? value.substring(1) : value;
    }

    const imageBase = environment.fileBaseURL || environment.baseAPIURL;
    const baseURL = imageBase.endsWith('/') ? imageBase : `${imageBase}/`;
    const normalizedBaseURL = baseURL.replace(/\/$/, '');

    if (value.startsWith('http://') || value.startsWith('https://')) {
      try {
        const parsedUrl = new URL(value);

        if ((parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1') && (parsedUrl.pathname.startsWith('/files/') || parsedUrl.pathname.startsWith('/private/'))) {
          const cleanPath = parsedUrl.pathname.replace(/^\//, '');
          return `${normalizedBaseURL}/${cleanPath}`;
        }

        return value;
      } catch {
        return value;
      }
    }
    
    // If the value already contains /files/ or /private/, it's a full relative path
    if (value.includes('/files/') || value.includes('/private/')) {
      return value.startsWith('/') ? `${normalizedBaseURL}${value}` : `${normalizedBaseURL}/${value}`;
    }

    // If it's just a filename (no slashes except at start), add /files/ prefix
    if (!value.includes('/') || value.startsWith('/')) {
      const cleanPath = value.startsWith('/') ? value.substring(1) : value;
      return `${normalizedBaseURL}/files/${cleanPath}`;
    }

    // Otherwise treat it as a relative path
    return value.startsWith('/') ? `${normalizedBaseURL}${value}` : `${normalizedBaseURL}/${value}`;
  }

  getItemGroups(): Observable<any[]> {
    const params = new HttpParams()
      .set('fields', JSON.stringify(['name', 'item_group_name', 'parent_item_group', 'is_group']))
      .set('limit_page_length', '100');

    return this.http
      .get<{ data: any[] }>(this.buildApiUrl('api/resource/Item%20Group'), {
        params,
        headers: this.authHeaders
      })
      .pipe(
        map((response) => response?.data || []),
        catchError(() => of([]))
      );
  }

  getWebsiteItems(limit = 24): Observable<WebsiteItem[]> {
    const params = new HttpParams()
      .set('fields', this.websiteItemFields)
      .set('order_by', 'modified desc')
      .set('limit_page_length', String(limit));

    return this.http
      .get<WebsiteItemListResponse>(this.endpoint, {
        params,
        headers: this.authHeaders,
        
      })
      .pipe(map((response) => response?.data || []));
  }

  getItemVariants(templateCode: string): Observable<ItemRecord[]> {
    const params = new HttpParams()
      .set('fields', this.itemFields)
      .set('filters', JSON.stringify([['Item', 'variant_of', '=', templateCode]]))
      .set('limit_page_length', '100');

    return this.http
      .get<{data: ItemRecord[]}>(this.itemEndpoint, {
        params,
        headers: this.authHeaders,
      })
      .pipe(map((response) => response?.data || []));
  }

  getVariantsWithPrices(templateCode: string): Observable<{item: ItemRecord, sellingPrice: number}[]> {
    return this.getItemVariants(templateCode).pipe(
      switchMap(variants => {
        if (!variants.length) return of([]);
        return forkJoin(
          variants.map(variant => 
            forkJoin({
              item: of(variant),
              sellingPrice: this.getItemSellingPrice(variant.item_code || variant.name, variant.item_name).pipe(catchError(() => of(0)))
            })
          )
        );
      })
    );
  }

  getWebsiteItem(name: string): Observable<WebsiteItem> {
    const cleanName = this.stripVersionSuffix(name);
    return this.http
      .get<WebsiteItemResponse>(`${this.endpoint}/${encodeURIComponent(cleanName)}`, {
        headers: this.authHeaders,
        
      })
      .pipe(map((response) => response?.data));
  }

  getWebsiteItemByRoute(route: string): Observable<WebsiteItem> {
    const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
    const params = new HttpParams()
      .set('fields', this.websiteItemFields)
      .set('filters', JSON.stringify([['Website Item', 'route', 'in', [normalizedRoute, normalizedRoute.substring(1)]]]))
      .set('limit_page_length', '1');

    return this.http
      .get<WebsiteItemListResponse>(this.endpoint, {
        params,
        headers: this.authHeaders,
        
      })
      .pipe(map((response) => response?.data?.[0]));
  }

  resolveWebsiteItem(identifier: string): Observable<WebsiteItem> {
    const cleanIdentifier = this.stripVersionSuffix(identifier);

    // We use the list API with or_filters to silently search for the item
    // without triggering a 404 Not Found error in the console if it doesn't exist.
    const params = new HttpParams()
      .set('fields', '["name"]')
      .set('or_filters', JSON.stringify([
        ['Website Item', 'route', '=', cleanIdentifier],
        ['Website Item', 'route', '=', cleanIdentifier.startsWith('/') ? cleanIdentifier.substring(1) : cleanIdentifier],
        ['Website Item', 'name', '=', cleanIdentifier],
        ['Website Item', 'item_code', '=', cleanIdentifier],
        ['Website Item', 'item_name', '=', cleanIdentifier],
        ['Website Item', 'web_item_name', '=', cleanIdentifier]
      ]))
      .set('limit_page_length', '1');

    return this.http.get<WebsiteItemListResponse>(this.endpoint, {
      params,
      headers: this.authHeaders
    }).pipe(
      switchMap(response => {
        const item = response?.data?.[0];
        if (!item || !item.name) {
          throw new Error(`Website Item not found for ${identifier}`);
        }
        // Since we know the exact Document name (e.g. WEB-ITM-0030) and that it exists,
        // this will fetch the full document (including specifications) without 404ing!
        return this.getWebsiteItem(item.name);
      })
    );
  }

  getItem(itemCode: string): Observable<ItemRecord> {
    return this.http
      .get<ItemResponse>(`${this.itemEndpoint}/${encodeURIComponent(itemCode)}`, {
        headers: this.authHeaders,
        
      })
      .pipe(map((response) => response?.data));
  }

  getItemSellingPrice(itemCode: string, itemName?: string): Observable<number> {
    const candidates = [itemCode, itemName]
      .filter((value): value is string => Boolean(value && value.trim()))
      .map((value) => value.trim());

    if (candidates.length === 0) {
      return of(0);
    }

    const params = new HttpParams()
      .set('fields', JSON.stringify(['name', 'item_code', 'price_list_rate', 'currency', 'price_list', 'selling']))
      .set('filters', JSON.stringify([
        ['Item Price', 'item_code', 'in', candidates]
      ]))
      .set('order_by', 'modified desc')
      .set('limit_page_length', '20');

    return this.http
      .get<ItemPriceListResponse>(this.itemPriceEndpoint, {
        params,
        headers: this.authHeaders,
        
      })
      .pipe(
        map((response) => {
          const rows = response?.data || [];
          if (!rows.length) {
            return 0;
          }

          const preferred = rows.find((row) => Number((row as Record<string, unknown>)['selling'] ?? 0) === 1)
            || rows.find((row) => String(row.price_list || '').toLowerCase().includes('selling'))
            || rows[0];

          return Number(preferred?.price_list_rate ?? 0);
        }),
        catchError(() => of(0))
      );
  }

  // Fetch ERPNext Pricing Rules for an item.
  // Frappe's REST API doesn't support child-table filters reliably (403/417/empty).
  // Strategy: fetch all active selling rules, then fetch each full doc and
  // filter client-side by item_code in the 'items' child table.
  getPricingRules(itemCode: string): Observable<PricingRuleSlab[]> {
    if (!itemCode) return of([]);

    // Step 1: Get list of all active selling Pricing Rules (parent-level filters only)
    const listParams = new HttpParams()
      .set('fields', JSON.stringify(['name', 'title']))
      .set('filters', JSON.stringify([
        ['Pricing Rule', 'selling', '=', 1],
        ['Pricing Rule', 'disable', '=', 0]
      ]))
      .set('limit_page_length', '100');

    return this.http.get<{data: any[]}>(
      this.buildApiUrl('api/resource/Pricing%20Rule'),
      { params: listParams, headers: this.authHeaders }
    ).pipe(
      switchMap(listRes => {
        const ruleNames: string[] = (listRes?.data || []).map((r: any) => r.name);
        if (!ruleNames.length) return of([] as PricingRuleSlab[]);

        // Step 2: Fetch each full Pricing Rule document (includes 'items' child table)
        const fullDocs$ = ruleNames.map(name =>
          this.http.get<{data: any}>(
            this.buildApiUrl(`api/resource/Pricing%20Rule/${encodeURIComponent(name)}`),
            { headers: this.authHeaders }
          ).pipe(
            map(r => r?.data),
            catchError(() => of(null))
          )
        );

        return forkJoin(fullDocs$).pipe(
          map(docs => docs
            .filter(doc => {
              if (!doc) return false;
              // 'items' is the ERPNext child table field for Pricing Rule Item Code rows
              const items: any[] = doc.items || doc.pricing_rule_item_code || [];
              return items.some((row: any) => row.item_code === itemCode);
            })
            .map(doc => ({
              name: doc.name || '',
              title: doc.title || '',
              minQty: Number(doc.min_qty || 0),
              maxQty: Number(doc.max_qty || 0),
              discountPercentage: Number(doc.discount_percentage || 0),
              discountAmount: Number(doc.discount_amount || 0),
              fixedPrice: Number(doc.price_list_rate || doc.rate || 0),
              uom: doc.uom || ''
            } as PricingRuleSlab))
          )
        );
      }),
      catchError(() => of([] as PricingRuleSlab[]))
    );
  }

  getWebsiteItemReviews(websiteItem: WebsiteItem): Observable<Record<string, unknown>[]> {
    const params = new HttpParams()
      .set('fields', JSON.stringify(['name']))
      .set('order_by', 'creation desc')
      .set('limit_page_length', '200');

    return this.http
      .get<GenericListResponse>(this.itemReviewEndpoint, {
        params,
        headers: this.authHeaders,
        
      })
      .pipe(
        map((response) => response?.data || []),
        switchMap((rows) => {
          if (rows.length === 0) {
            return of([] as Record<string, unknown>[]);
          }

          return forkJoin(
            rows.map((row) =>
              this.http
                .get<GenericDocResponse>(`${this.itemReviewEndpoint}/${encodeURIComponent(row.name)}`, {
                  headers: this.authHeaders,
                  
                })
                .pipe(
                  map((docResponse) => docResponse?.data),
                  catchError(() => of(null))
                )
            )
          ).pipe(map((docs) => docs.filter((doc): doc is Record<string, unknown> => Boolean(doc))));
        }),
        map((docs) => this.filterReviewsForItem(docs, websiteItem)),
        catchError(() => of([]))
      );
  }

  // Create a new Item Review doc, matching the fields ERPNext's own webshop
  // "Write a Review" form saves: website_item, item, user, customer,
  // review_title, rating (0-1, i.e. stars/5), comment.
  createItemReview(payload: {
    website_item: string;
    item: string;
    user: string;
    customer: string;
    review_title: string;
    rating: number;
    comment: string;
  }): Observable<any> {
    return this.http.post(this.itemReviewEndpoint, payload, { headers: this.authHeaders });
  }

  // All files attached (in ERPNext's own "Attachments" panel) to a given doc,
  // e.g. a Website Item or Item — so the product gallery can show every image
  // an admin uploaded there, not just the single website_image/thumbnail field.
  getAttachedImages(doctype: string, docname: string | undefined | null): Observable<string[]> {
    if (!docname) return of([]);

    const params = new HttpParams()
      .set('filters', JSON.stringify([
        ['attached_to_doctype', '=', doctype],
        ['attached_to_name', '=', docname]
      ]))
      .set('fields', JSON.stringify(['file_url']))
      .set('limit_page_length', '0');

    return this.http.get<{ data: { file_url: string }[] }>(this.buildApiUrl('api/resource/File'), {
      params,
      headers: this.authHeaders
    }).pipe(
      map((res) => (res?.data || [])
        .map((row) => row.file_url)
        .filter((url): url is string => Boolean(url))
        .map((url) => this.resolveImageUrl(url))
      ),
      catchError(() => of([] as string[]))
    );
  }

  private filterReviewsForItem(docs: Record<string, unknown>[], websiteItem: WebsiteItem): Record<string, unknown>[] {
    const routeValue = websiteItem.route ? websiteItem.route.replace(/^\//, '') : '';
    const candidateSet = new Set(
      [
        websiteItem.name,
        websiteItem.item_code,
        websiteItem.item_name,
        websiteItem.web_item_name,
        websiteItem.route,
        routeValue
      ]
        .filter((value): value is string => Boolean(value && value.trim().length > 0))
        .map((value) => this.normalizeLookupValue(value))
    );

    return docs.filter((doc) => {
      const published = doc['published'];
      if (published !== undefined && published !== null && Number(published) === 0) {
        return false;
      }

      const keysToMatch = [
        'item',
        'website_item',
        'web_item',
        'item_code',
        'item_name',
        'item_reviewed',
        'reference_name',
        'reference_doctype_name',
        'route'
      ];

      for (const key of keysToMatch) {
        const value = doc[key];
        if (typeof value === 'string' && candidateSet.has(this.normalizeLookupValue(value))) {
          return true;
        }
      }

      return false;
    });
  }

  // Fetch all active selling Pricing Rules and build a Map: item_code → ALL matching slabs
  // (one entry per qty band), so list/card pages can apply the same tiered pricing as the
  // product detail page instead of only the single best-discount rule.
  getAllActivePricingRuleSlabs(): Observable<Map<string, PricingRuleSlab[]>> {
    const listParams = new HttpParams()
      .set('fields', JSON.stringify(['name']))
      .set('filters', JSON.stringify([
        ['Pricing Rule', 'selling', '=', 1],
        ['Pricing Rule', 'disable', '=', 0]
      ]))
      .set('limit_page_length', '100');

    return this.http.get<{data: any[]}>(
      this.buildApiUrl('api/resource/Pricing%20Rule'),
      { params: listParams, headers: this.authHeaders }
    ).pipe(
      switchMap(listRes => {
        const names: string[] = (listRes?.data || []).map((r: any) => r.name);
        if (!names.length) return of(new Map<string, PricingRuleSlab[]>());

        const fullDocs$ = names.map(name =>
          this.http.get<{data: any}>(
            this.buildApiUrl(`api/resource/Pricing%20Rule/${encodeURIComponent(name)}`),
            { headers: this.authHeaders }
          ).pipe(map(r => r?.data), catchError(() => of(null)))
        );

        return forkJoin(fullDocs$).pipe(
          map(docs => {
            const slabMap = new Map<string, PricingRuleSlab[]>();
            docs.forEach(doc => {
              if (!doc) return;
              const items: any[] = doc.items || doc.pricing_rule_item_code || [];
              const slab: PricingRuleSlab = {
                name: doc.name || '',
                title: doc.title || '',
                minQty: Number(doc.min_qty || 0),
                maxQty: Number(doc.max_qty || 0),
                discountPercentage: Number(doc.discount_percentage || 0),
                discountAmount: Number(doc.discount_amount || 0),
                fixedPrice: Number(doc.price_list_rate || doc.rate || 0),
                uom: doc.uom || ''
              };
              items.forEach((row: any) => {
                if (!row.item_code) return;
                const existing = slabMap.get(row.item_code) || [];
                existing.push(slab);
                slabMap.set(row.item_code, existing);
              });
            });
            return slabMap;
          })
        );
      }),
      catchError(() => of(new Map<string, PricingRuleSlab[]>()))
    );
  }
}
