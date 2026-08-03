import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService, WishlistItem } from 'src/app/core/services/wishlist.service';
import { Product } from 'src/app/modules/product/model';
import { MENU } from 'src/app/shared/constant';
import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit, OnDestroy {
  cart:Product[]=[];
  wishlist: WishlistItem[] = [];
  menulist:{title:string;path:string}[]=MENU;
  isMenu=false;
  private wishlistSub!: Subscription;
  constructor(private cartService:CartService, private wishlistService: WishlistService, public authService:FirebaseAuthService){
  }
  openMenu(){
    this.isMenu=true;
  }
  closeMenu(){
    this.isMenu=false;
  }
  logOut(){
    this.authService.logout();
  }
  ngOnInit(): void {
    this.cart=this.cartService.getCart;
    this.wishlistSub = this.wishlistService.wishlist$.subscribe(items => {
      this.wishlist = items;
    });
  }
  ngOnDestroy(): void {
    this.wishlistSub?.unsubscribe();
  }
}
