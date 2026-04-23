import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from 'src/app/modules/product/model';
import { ProductService } from 'src/app/modules/product/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-searchresult',
  templateUrl: './searchresult.component.html',
  styles: [
  ]
})
export class SearchresultComponent implements OnInit{
  products:Product[]=[];
  cart: Product[] = [];
  isLoading = false;
  error!:string;
  searchKeyword!:string;
  constructor(private productService:ProductService, private route:ActivatedRoute, private cartService: CartService){
  }
  ngOnInit(): void {
    this.cart = this.cartService.getCart;
    this.getResults();
  }
  getResults(){
    this.isLoading = true;
    this.route.queryParams.subscribe((params:Params)=>{
      this.searchKeyword=params['q'];
      this.productService.search(params['q']).subscribe((data)=>{
      this.isLoading = false;
      this.products=data
    },error=>this.error=error.message)
    })
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
