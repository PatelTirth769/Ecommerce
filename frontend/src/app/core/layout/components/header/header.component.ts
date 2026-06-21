import { Component,OnInit } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { Product } from 'src/app/modules/product/model';
import { MENU } from 'src/app/shared/constant';
import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit{
  cart:Product[]=[];
  menulist:{title:string;path:string}[]=MENU;
  isMenu=false;
  constructor(private cartService:CartService, public authService:FirebaseAuthService){
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
  }
}
