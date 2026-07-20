import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { CartComponent } from './features/cart/cart.component';
import { Page404Component } from './features/page404/page404.component';
import { CheckoutComponent } from './modules/product/components/checkout/checkout.component';
import { canActivate } from './shared/services/auth/authguard.service';
import { SearchresultComponent } from './features/searchresult/searchresult.component';
import { ProductMasterComponent } from './features/product-master/product-master.component';
import { BuyerProfileComponent } from './features/buyer-profile/buyer-profile.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { ComingSoonComponent } from './features/coming-soon/coming-soon.component';
import { OrderConfirmationComponent } from './features/order-confirmation/order-confirmation.component';

const routes: Routes = [
  {
    path:'',
    component:HomeComponent,
    canActivate:[canActivate]
  },
  {
    path:'login',
    component:LoginComponent,
    // canActivate:[canActivate]
  },
  {
    path:'register',
    component:RegisterComponent,
    // canActivate:[canActivate]
  },
  {
    path:'products',
    component:SearchresultComponent,
    canActivate:[canActivate]
  },
  {
    path:'product-master',
    component:ProductMasterComponent,
    canActivate:[canActivate]
  },
  {
    path:'store-list',
    component:ComingSoonComponent,
    canActivate:[canActivate]
  },
  {
    path:'categories',
    pathMatch: 'full',
    redirectTo: 'categories/All Item Groups'
  },
  {
    path:'categories',
    loadChildren:()=>import('./modules/product/product.module').then(m=>m.ProductModule),
    canActivate:[canActivate]
  },
  {
    path:'shopping-cart',
    component:CartComponent,
    canActivate:[canActivate]
  },
  {
    path:'checkout',
    component:CheckoutComponent,
    canActivate:[canActivate],
  },
  {
    path: 'profile',
    component: BuyerProfileComponent,
    canActivate:[canActivate]
  },
  {
    path: 'order-confirmation/:razorpayOrderId',
    component: OrderConfirmationComponent,
    canActivate:[canActivate]
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [canActivate]
  },
  {
    path:'**',
    component:Page404Component,
    data:{message:'Oops... This is a Bad request'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy:PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
