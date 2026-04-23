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
    'website_image',
    'thumbnail',
    'standard_rate',
    'disabled',
    'has_variants',
    'variant_of',
    'published',
    'modified'
  ]);

  constructor(private http: HttpClient) {}

  private buildApiUrl(path: string): string {
    const baseUrl = environment.baseAPIURL.endsWith('/') ? environment.baseAPIURL : `${environment.baseAPIURL}/`;
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

  getWebsiteItems(limit = 24): Observable<WebsiteItem[]> {
    const params = new HttpParams()
      .set('fields', this.websiteItemFields)
      .set('order_by', 'modified desc')
      .set('limit_page_length', String(limit));

    return this.http
      .get<WebsiteItemListResponse>(this.endpoint, {
        params,
        withCredentials: true
      })
      .pipe(map((response) => response?.data || []));
  }

  getWebsiteItem(name: string): Observable<WebsiteItem> {
    const cleanName = this.stripVersionSuffix(name);
    return this.http
      .get<WebsiteItemResponse>(`${this.endpoint}/${encodeURIComponent(cleanName)}`, {
        withCredentials: true
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
        withCredentials: true
      })
      .pipe(map((response) => response?.data?.[0]));
  }

  resolveWebsiteItem(identifier: string): Observable<WebsiteItem> {
    const cleanIdentifier = this.stripVersionSuffix(identifier);
    const normalizedIdentifier = this.normalizeLookupValue(cleanIdentifier);

    return this.getWebsiteItem(cleanIdentifier).pipe(
      catchError(() => this.getWebsiteItemByRoute(cleanIdentifier)),
      catchError(() => this.getWebsiteItemByAnyIdentifier(normalizedIdentifier)),
      switchMap((item) => {
        if (!item) {
          throw new Error(`Website Item not found for ${identifier}`);
        }

        // Always re-fetch by name to get full Website Item document including custom fields.
        return this.getWebsiteItem(item.name).pipe(catchError(() => of(item)));
      })
    );
  }

  private getWebsiteItemByAnyIdentifier(identifier: string): Observable<WebsiteItem | undefined> {
    return this.getWebsiteItems(1000).pipe(
      map((items) => items.find((item) => {
        const route = item.route ? this.normalizeLookupValue(item.route) : '';
        const name = this.normalizeLookupValue(item.name || '');
        const itemCode = this.normalizeLookupValue(item.item_code || '');
        const itemName = this.normalizeLookupValue(item.item_name || '');
        const webItemName = this.normalizeLookupValue(item.web_item_name || '');

        return [route, name, itemCode, itemName, webItemName].includes(identifier);
      }))
    );
  }

  getItem(itemCode: string): Observable<ItemRecord> {
    return this.http
      .get<ItemResponse>(`${this.itemEndpoint}/${encodeURIComponent(itemCode)}`, {
        withCredentials: true
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
        withCredentials: true
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

  getWebsiteItemReviews(websiteItem: WebsiteItem): Observable<Record<string, unknown>[]> {
    const params = new HttpParams()
      .set('fields', JSON.stringify(['name']))
      .set('order_by', 'creation desc')
      .set('limit_page_length', '200');

    return this.http
      .get<GenericListResponse>(this.itemReviewEndpoint, {
        params,
        withCredentials: true
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
                  withCredentials: true
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
}
