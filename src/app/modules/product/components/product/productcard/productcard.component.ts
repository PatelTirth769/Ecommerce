import { Component,Input,OnInit } from '@angular/core';
import { Product } from '../../../model';
import { CartService } from 'src/app/core/services/cart.service';
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
export class ProductcardComponent implements OnInit  {
  @Input() product!:Product;
  ratingList!:boolean[];
  cart:Product[]=[];
  discount=0;
  constructor(private cartService:CartService, private productService:ProductService){}

  ngOnInit(): void {
    this.cart=this.cartService.getCart;
    this.discount=this.product&&Math.round(100-(this.product.price/this.product.prevprice)*100);
    this.getRatingStar();
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

  private getCartKey(product: Product): string {
    return String(product.item_code || product.type || product.id || product.title || '').trim().toLowerCase();
  }
  
  getRatingStar(){
    this.ratingList=this.productService.getRatingStar(this.product);
  }

}
