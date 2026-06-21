import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../../model';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService, WishlistItem } from '../../../core/services/wishlist.service';
import { ProductService } from '../../../services/product.service';
import { Router,NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-productcard',
  templateUrl: './productcard.component.html',
  styles: [
  ]
})
export class ProductcardComponent implements OnInit, OnDestroy {
  @Input() product!:Product;
  ratingList!:boolean[];
  cart:Product[]=[];
  wishlist: WishlistItem[] = [];
  discount=0;
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

  addToCart(product:Product){
   this.cartService.add(product);
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

  toggleWishlist(product: Product): void {
    this.wishlistService.toggleWishlist(product).subscribe();
  }

  private getCartKey(product: Product): string {
    return String(product.item_code || product.type || product.id || product.title || '').trim().toLowerCase();
  }

  
  getRatingStar(){
    this.ratingList=this.productService.getRatingStar(this.product);
  }

}
