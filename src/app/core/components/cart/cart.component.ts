import { Component,OnDestroy,OnInit } from '@angular/core';
import { Product } from 'src/app/modules/product/model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styles: [
    `
    /* hide scrollbar */
  ::-webkit-scrollbar {
    width: 0px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(136, 136, 136, 0.281);
  }
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
    `
  ]
})
export class CartComponent implements OnInit, OnDestroy{
  cart:Product[]|any=[];
  promoCode = '';
  appliedCouponCode = '';
  couponMessage = '';
  couponMessageType: 'success' | 'error' | '' = '';
  isApplyingCoupon = false;
  total!:number;
  gstAmount!:number;
  shippingCost!:number;
  discountAmount!:number;
  estimatedTotal!:number;
  billingSameAsShipping = true;
  gstRate=0.18;
  subsTotal!:Subscription;
  subsGST!:Subscription;
  subsShipping!:Subscription;
  subsDiscount!:Subscription;
  subsEstimatedTotal!:Subscription;
  subsCouponCode!:Subscription;
  constructor(private cartService:CartService,private router:Router){}

  ngOnInit(): void {
    this.getCart();
    this.getTotal();
  }
  
  getCart(){
    this.cart=this.cartService.getCart;
  }
  getTotal(){
    this.total=this.cartService.getTotal();
    this.subsTotal=this.cartService.totalAmount.subscribe(data=>this.total=Number(data.toFixed(2)));
    this.subsGST=this.cartService.gstAmount.subscribe(data=>this.gstAmount=Number(data.toFixed(2)));
    this.subsShipping=this.cartService.shippingAmount.subscribe(data=>this.shippingCost=Number(data.toFixed(2)));
    this.subsDiscount=this.cartService.discountAmount.subscribe(data=>this.discountAmount=Number(data.toFixed(2)));
    this.subsEstimatedTotal=this.cartService.estimatedTotal.subscribe(data=>this.estimatedTotal=Number(data.toFixed(2)));
    this.subsCouponCode=this.cartService.appliedCouponCode.subscribe((code)=>{
      this.appliedCouponCode=code;
      if(code && !this.promoCode){
        this.promoCode=code;
      }
    });
  }

  applyCoupon(): void {
    this.couponMessage = '';
    this.couponMessageType = '';
    this.isApplyingCoupon = true;

    this.cartService.applyCoupon(this.promoCode).subscribe((result) => {
      this.isApplyingCoupon = false;
      this.couponMessage = result.message;
      this.couponMessageType = result.success ? 'success' : 'error';
      if (result.success) {
        this.promoCode = this.appliedCouponCode || this.promoCode;
      }
    });
  }
  goToCheckout(){
    this.router.navigate(['/checkout']);
  }

  unsubscribeSubject(){
    this.subsTotal?.unsubscribe();
    this.subsGST?.unsubscribe();
    this.subsShipping?.unsubscribe();
    this.subsDiscount?.unsubscribe();
    this.subsEstimatedTotal?.unsubscribe();
    this.subsCouponCode?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject();
  }
}
