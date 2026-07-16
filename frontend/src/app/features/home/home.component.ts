import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/modules/product/model';
import { ProductService } from 'src/app/modules/product/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WebsiteItemService } from 'src/app/core/services/website-item.service';
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
  cart: Product[] = [];
  skeletons:number[]=[...new Array(6)];
  error!:string;
  isLoading=false;
  images:string[]=[
    // "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    // "https://www.creativefabrica.com/wp-content/uploads/2021/05/15/Quote-T-shirt-design-001-Graphics-12041380-1.jpg",
    // "https://www.apetogentleman.com/wp-content/uploads/2022/10/graphic-tees-men-1.jpg",

    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&h=500&q=80",
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&h=500&q=80",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&h=500&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&h=500&q=80"

  ];

  constructor(private _productService:ProductService, private cartService: CartService, private websiteItemService: WebsiteItemService){
  }
  ngOnInit(): void {
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

        // Just take a few random items to display on home page
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 6);

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
          next: (enrichedItems) => {
            this.products = enrichedItems;
            this.isLoading = false;
          },
          error: () => {
            this.products = selected.map((item) => this.toProduct(item, null, 0));
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }

  private toProduct(websiteItem: any, item: any | null, sellingPrice: number): any {
    const images = [];
    if (websiteItem.website_image) images.push(websiteItem.website_image);
    if (item?.image) images.push(item.image);
    if (item?.website_image) images.push(item.website_image);
    if (images.length === 0) images.push('assets/images/logo.png');

    return {
      id: websiteItem.name,
      title: websiteItem.web_item_name || websiteItem.item_name || websiteItem.name,
      description: websiteItem.web_long_description || websiteItem.short_description || item?.description || '',
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
      modified: websiteItem.modified || item?.modified || new Date()
    };
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
}
