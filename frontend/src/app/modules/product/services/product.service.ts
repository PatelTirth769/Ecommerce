import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { Product } from '../model';
import { APPROVED_DUMMY_PRODUCTS } from './approved-dummy-products';

interface ProductApiShape {
  id?: number;
  title?: string;
  description?: string;
  category?: string;
  type?: string;
  sizes?: Array<string | number>;
  images?: string[];
  stock?: string;
  price?: number;
  prevprice?: number;
  item_code?: string;
  rating?: {
    rate?: number;
    count?: number;
  };
  name?: string;
  item_name?: string;
  web_item_name?: string;
  web_long_description?: string;
  item_group?: string;
  website_image?: string;
  standard_rate?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly url = (environment.baseAPIURL || '/') + environment.productsEndpoint;
  private readonly fallbackProducts: Product[] = APPROVED_DUMMY_PRODUCTS.map((item) => this.toProduct(item as unknown as ProductApiShape));

  products = new BehaviorSubject<Product[]>([]);
  ratingList: boolean[] = [];

  constructor(private http: HttpClient) {}

  private toProduct(item: any): Product {
    const title = item.title ?? item.web_item_name ?? item.item_name ?? item.name ?? '';
    const images = item.images ?? (item.website_image ? [item.website_image] : []);
    
    return {
      id: Number(item.id ?? item.name ?? 0),
      title: title,
      description: item.description ?? item.web_long_description ?? item.short_description ?? '',
      category: item.category ?? item.item_group ?? '',
      type: item.type ?? item.item_group ?? '',
      sizes: (item.sizes ?? []).map((size: any) => String(size)),
      images: images,
      stock: item.stock ?? 'In stock',
      price: Number(item.price ?? item.standard_rate ?? 0),
      prevprice: Number(item.prevprice ?? 0),
      item_code: item.item_code ?? item.name,
      rating: {
        rate: Number(item.rating?.rate ?? 0),
        count: Number(item.rating?.count ?? 0)
      }
    };
  }

  private normalizeProducts(data: any): Product[] {
    if (!data) return [];
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => this.toProduct(item));
    }
    if (data.message && Array.isArray(data.message)) {
      return data.message.map((item: any) => this.toProduct(item));
    }

    if (Array.isArray(data)) {
      return data.map((item: any) => this.toProduct(item));
    }

    const normalizedProducts: Product[] = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        normalizedProducts.push(this.toProduct(data[key]));
      }
    }

    return normalizedProducts;
  }

  private normalizeValue(value: string): string {
    return value.trim().toLowerCase();
  }

  private getValidProducts(data: any): Product[] {
    let products = this.normalizeProducts(data);
    products = products.filter(p => p.title && p.title.trim() !== '' && p.images && p.images.length > 0 && p.price > 0);
    return products.length > 0 ? products : this.fallbackProducts;
  }

  get get(): Observable<Product[]> {
    return this.http.get<any>(this.url).pipe(
      map((data) => this.getValidProducts(data)),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return of(this.fallbackProducts);
      })
    );
  }

  getByCategory(category: string): Observable<Product[]> {
    return this.http.get<any>(this.url, {
      params: new HttpParams().set('category', category)
    }).pipe(
      map((data) => {
        const products = this.getValidProducts(data);
        const normalizedCategory = this.normalizeValue(category);
        return products.filter((item) => this.normalizeValue(item.category) === normalizedCategory);
      }),
      catchError((error) => {
        console.error('Error fetching products by category:', error);
        const normalizedCategory = this.normalizeValue(category);
        return of(this.fallbackProducts.filter((item) => this.normalizeValue(item.category) === normalizedCategory));
      })
    );
  }

  getRelated(type: string): Observable<Product[]> {
    return this.http.get<any>(this.url, {
      params: new HttpParams().set('type', type)
    }).pipe(
      map((data) => {
        const products = this.getValidProducts(data);
        const normalizedType = this.normalizeValue(type);
        return products.filter((item) => this.normalizeValue(item.type) === normalizedType);
      }),
      catchError((error) => {
        console.error('Error fetching related products:', error);
        const normalizedType = this.normalizeValue(type);
        return of(this.fallbackProducts.filter((item) => this.normalizeValue(item.type) === normalizedType));
      })
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<any>(`${this.url}/${id}`).pipe(
      map((item) => this.toProduct(item)),
      catchError((error) => {
        console.error('Error fetching product:', error);
        const product = this.fallbackProducts.find((item) => item.id === Number(id)) || this.fallbackProducts[0];
        return of(product);
      })
    );
  }

  search(query: string): Observable<Product[]> {
    return this.http.get<any>(this.url, {
      params: new HttpParams().set('q', query)
    }).pipe(
      map((data) => {
        const products = this.getValidProducts(data);
        const normalizedQuery = this.normalizeValue(query || '');
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
      }),
      catchError((error) => {
        console.error('Error searching products:', error);
        const normalizedQuery = this.normalizeValue(query || '');
        if (!normalizedQuery) {
          return of(this.fallbackProducts);
        }

        return of(this.fallbackProducts.filter((item) => {
          const title = this.normalizeValue(item.title);
          const description = this.normalizeValue(item.description);
          const category = this.normalizeValue(item.category);
          const type = this.normalizeValue(item.type);
          return title.includes(normalizedQuery) || description.includes(normalizedQuery) || category.includes(normalizedQuery) || type.includes(normalizedQuery);
        }));
      })
    );
  }

  getRatingStar(product: Product) {
    this.ratingList = [];
    [...Array(5)].map((_, index) => {
      return index + 1 <= Math.trunc(product?.rating.rate) ? this.ratingList.push(true) : this.ratingList.push(false);
    });
    return this.ratingList;
  }
}
