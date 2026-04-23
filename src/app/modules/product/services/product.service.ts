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
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly url = environment.baseAPIURL + environment.productsEndpoint;
  private readonly fallbackProducts: Product[] = APPROVED_DUMMY_PRODUCTS.map((item) => this.toProduct(item as unknown as ProductApiShape));

  products = new BehaviorSubject<Product[]>([]);
  ratingList: boolean[] = [];

  constructor(private http: HttpClient) {}

  private toProduct(item: ProductApiShape): Product {
    return {
      id: Number(item.id ?? 0),
      title: item.title ?? '',
      description: item.description ?? '',
      category: item.category ?? '',
      type: item.type ?? '',
      sizes: (item.sizes ?? []).map((size) => String(size)),
      images: item.images ?? [],
      stock: item.stock ?? 'In stock',
      price: Number(item.price ?? 0),
      prevprice: Number(item.prevprice ?? 0),
      item_code: item.item_code,
      rating: {
        rate: Number(item.rating?.rate ?? 0),
        count: Number(item.rating?.count ?? 0)
      }
    };
  }

  private normalizeProducts(data: Product[] | Record<string, ProductApiShape>): Product[] {
    if (Array.isArray(data)) {
      return data.map((item) => this.toProduct(item));
    }

    const normalizedProducts: Product[] = [];
    for (const key in data) {
      normalizedProducts.push(this.toProduct(data[key]));
    }

    return normalizedProducts;
  }

  private normalizeValue(value: string): string {
    return value.trim().toLowerCase();
  }

  get get(): Observable<Product[]> {
    return this.http.get<Product[] | Record<string, ProductApiShape>>(this.url).pipe(
      map((data) => this.normalizeProducts(data)),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return of(this.fallbackProducts);
      })
    );
  }

  getByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[] | Record<string, ProductApiShape>>(this.url, {
      params: new HttpParams().set('category', category)
    }).pipe(
      map((data) => {
        const products = this.normalizeProducts(data);
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
    return this.http.get<Product[] | Record<string, ProductApiShape>>(this.url, {
      params: new HttpParams().set('type', type)
    }).pipe(
      map((data) => {
        const products = this.normalizeProducts(data);
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
    return this.http.get<ProductApiShape>(`${this.url}/${id}`).pipe(
      map((item) => this.toProduct(item)),
      catchError((error) => {
        console.error('Error fetching product:', error);
        const product = this.fallbackProducts.find((item) => item.id === Number(id)) || this.fallbackProducts[0];
        return of(product);
      })
    );
  }

  search(query: string): Observable<Product[]> {
    return this.http.get<Product[] | Record<string, ProductApiShape>>(this.url, {
      params: new HttpParams().set('q', query)
    }).pipe(
      map((data) => {
        const products = this.normalizeProducts(data);
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
