import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from 'src/app/modules/product/model';
import { environment } from 'src/environments/environment';

export interface WishlistItem {
  item_code: string;
  website_item?: string;
  web_item_name?: string;
  item_name?: string;
  item_group?: string;
  route?: string;
  image?: string;
}

// Backed by ERPNext's own webshop Wishlist doctype (same one the native storefront
// uses), via its whitelisted add_to_wishlist/remove_from_wishlist RPC methods.
// Those methods key off frappe.session.user server-side, so calls MUST go through
// the logged-in user's session cookie (withCredentials), never the admin API token,
// or every user's wishlist would collide into the API key owner's single doc.
@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly ADMIN_TOKEN = 'token 764ae0b7b89ab0f:c69b450d20ffcf2';
  private readonly wishlistEndpoint = this.buildApiUrl('api/resource/Wishlist');
  private readonly addToWishlistEndpoint = this.buildApiUrl('api/method/webshop.webshop.doctype.wishlist.wishlist.add_to_wishlist');
  private readonly removeFromWishlistEndpoint = this.buildApiUrl('api/method/webshop.webshop.doctype.wishlist.wishlist.remove_from_wishlist');

  private wishlistItems: WishlistItem[] = [];
  private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);

  public wishlist$: Observable<WishlistItem[]> = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refresh();
  }

  private buildApiUrl(path: string): string {
    const base = environment.baseAPIURL || '';
    if (!base) {
      return path.startsWith('/') ? path : `/${path}`;
    }
    const baseUrl = base.endsWith('/') ? base : `${base}/`;
    return `${baseUrl}${path}`;
  }

  private getCurrentUserEmail(): string {
    try {
      const stored = localStorage.getItem('erpnext_user');
      if (stored) {
        const user = JSON.parse(stored);
        return user?.email || user?.name || '';
      }
    } catch {
      // ignore malformed storage
    }
    return '';
  }

  // Re-fetch the current user's Wishlist doc (name == user email in ERPNext) so
  // the local cache reflects server truth, including fields (website_item, route,
  // image) the whitelisted add method fills in that we don't know client-side.
  public refresh(): void {
    const email = this.getCurrentUserEmail();
    if (!email) {
      this.wishlistItems = [];
      this.wishlistSubject.next([]);
      return;
    }

    this.http.get<{ data: any }>(`${this.wishlistEndpoint}/${encodeURIComponent(email)}`, {
      headers: { 'Authorization': this.ADMIN_TOKEN }
    }).pipe(
      map((res) => (res?.data?.items || []).map((row: any) => ({
        item_code: row.item_code,
        website_item: row.website_item,
        web_item_name: row.web_item_name,
        item_name: row.item_name,
        item_group: row.item_group,
        route: row.route,
        image: row.image
      } as WishlistItem))),
      catchError(() => of([] as WishlistItem[]))
    ).subscribe((items) => {
      this.wishlistItems = items;
      this.wishlistSubject.next([...this.wishlistItems]);
    });
  }

  public toggleWishlist(product: Product): Observable<unknown> {
    const itemCode = product.item_code || product.type || '';
    if (!itemCode) return of(null);

    const existingIndex = this.wishlistItems.findIndex((i) => i.item_code === itemCode);
    const wasInWishlist = existingIndex >= 0;

    // Optimistic local update so the heart icon reacts instantly
    if (wasInWishlist) {
      this.wishlistItems.splice(existingIndex, 1);
    } else {
      this.wishlistItems.push({
        item_code: itemCode,
        web_item_name: product.title,
        item_name: product.title,
        image: product.images?.[0]
      });
    }
    this.wishlistSubject.next([...this.wishlistItems]);

    const formData = new FormData();
    formData.append('item_code', itemCode);
    const endpoint = wasInWishlist ? this.removeFromWishlistEndpoint : this.addToWishlistEndpoint;

    return this.http.post(endpoint, formData, { withCredentials: true }).pipe(
      tap(() => this.refresh()),
      catchError((err) => {
        console.error('[Wishlist] toggle failed, reverting to server state:', err);
        this.refresh();
        return of(null);
      })
    );
  }

  public isInWishlist(itemCode: string): boolean {
    return this.wishlistItems.some((i) => i.item_code === itemCode);
  }

  public remove(itemCode: string): void {
    const existingIndex = this.wishlistItems.findIndex((i) => i.item_code === itemCode);
    if (existingIndex < 0) return;

    this.wishlistItems.splice(existingIndex, 1);
    this.wishlistSubject.next([...this.wishlistItems]);

    const formData = new FormData();
    formData.append('item_code', itemCode);
    this.http.post(this.removeFromWishlistEndpoint, formData, { withCredentials: true }).pipe(
      tap(() => this.refresh()),
      catchError((err) => {
        console.error('[Wishlist] remove failed, reverting to server state:', err);
        this.refresh();
        return of(null);
      })
    ).subscribe();
  }

  public get count(): number {
    return this.wishlistItems.length;
  }

  // Called on logout — drops the local cache without hitting the server
  // (there's nothing to delete server-side, the next user's session just
  // shouldn't see the previous user's wishlist).
  public clear(): void {
    this.wishlistItems = [];
    this.wishlistSubject.next([]);
  }
}
