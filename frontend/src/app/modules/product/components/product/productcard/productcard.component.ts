import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../../model';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService, WishlistItem } from 'src/app/core/services/wishlist.service';
import { ProductService } from '../../../services/product.service';
import { Router,NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-productcard',
  templateUrl: './productcard.component.html',
  host: {
    class: 'block h-full'
  },
  styles: [
  ]
})
export class ProductcardComponent implements OnInit, OnDestroy {
  @Input() product!:Product;
  ratingList!:boolean[];
  cart:Product[]=[];
  wishlist: WishlistItem[] = [];
  discount=0;
  qty = 1;
  private cartSub!: Subscription;
  private wishlistSub!: Subscription;
  constructor(private cartService:CartService, private productService:ProductService, private wishlistService: WishlistService){}

  ngOnInit(): void {
    this.cartSub = this.cartService.cart$.subscribe(cartItems => {
      this.cart = cartItems;
    });
    this.wishlistSub = this.wishlistService.wishlist$.subscribe((items: WishlistItem[]) => {
      this.wishlist = items;
    });
    this.discount=this.product&&Math.round(100-(this.product.price/this.product.prevprice)*100);
    this.getRatingStar();
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
    this.wishlistSub?.unsubscribe();
  }

  increaseQty(): void {
    this.qty++;
  }

  decreaseQty(): void {
    if (this.qty > 1) this.qty--;
  }

  onQtyChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.qty = value > 0 ? Math.floor(value) : 1;
  }

  addToCart(product:Product){
   this.cartService.add({ ...product, qty: this.qty });
   this.qty = 1;
  }

  removeFromCart(product:Product){
    this.cartService.remove(product);    
  }

  isProductInCart(product:Product){
    return this.cart.some(item => this.getCartKey(item) === this.getCartKey(product));
  }

  isProductInWishlist(product: Product): boolean {
    const itemCode = product.item_code || product.type || '';
    return this.wishlist.some(i => i.item_code === itemCode);
  }

  toggleWishlist(product: Product, event?: Event): void {
    // The heart button sits inside the product-detail <a routerLink>; without
    // this the click bubbles up and navigates to the product page too.
    event?.stopPropagation();
    event?.preventDefault();
    this.wishlistService.toggleWishlist(product).subscribe();
  }

  private getCartKey(product: Product): string {
    return String(product.item_code || product.type || product.id || product.title || '').trim().toLowerCase();
  }

  
  getRatingStar(){
    this.ratingList=this.productService.getRatingStar(this.product);
  }

}
