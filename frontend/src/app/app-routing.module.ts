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
import { SellerScreenComponent } from './features/seller-screen/seller-screen.component';
import { SellerRegistrationComponent } from './features/seller-registration/seller-registration.component';
import { BuyerProfileComponent } from './features/buyer-profile/buyer-profile.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';

const routes: Routes = [
  {
    path:'',
    component:HomeComponent
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
    component:SearchresultComponent
  },
  {
    path:'product-master',
    component:ProductMasterComponent,
    canActivate:[canActivate]
  },
  {
    path:'categories',
    loadChildren:()=>import('./modules/product/product.module').then(m=>m.ProductModule)
  },
  {
    path:'shopping-cart',
    component:CartComponent
  },
  {
    path:'checkout',
    component:CheckoutComponent,
    canActivate:[canActivate],
  },
  {
    path: 'seller-screen',
    component: SellerScreenComponent
  },
  {
    path: 'register-seller',
    component: SellerRegistrationComponent
  },
  {
    path: 'profile',
    component: BuyerProfileComponent
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
