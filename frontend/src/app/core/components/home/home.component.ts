import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/modules/product/model';
import { ProductService } from 'src/app/modules/product/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit{
  products:Product[]=[];
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

  constructor(private _productService:ProductService, private cartService: CartService){
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
    const startIndex=Math.round(Math.random()*20);
    const lastIndex=startIndex+6;
    this._productService.get.subscribe(data=>{
      this.isLoading=false;
      this.products=data.slice(startIndex,lastIndex);
    },
    error=>this.error=error.message
    );
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
}
