import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/layout/components/header/header.component';
import { FooterComponent } from './core/layout/components/footer/footer.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { CarouselComponent } from './features/home/carousel/carousel.component';
import { CartComponent } from './features/cart/cart.component';
import { CartitemComponent } from './features/cart/cartitem/cartitem.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Page404Component } from './features/page404/page404.component';
import { SearchresultComponent } from './features/searchresult/searchresult.component';
import { SearchComponent } from './core/layout/components/header/search/search.component';
import { AuthinterceptorService } from './shared/services/auth/authinterceptor.service';
import { SharedModule } from './shared/shared.module';
import { ProductMasterComponent } from './features/product-master/product-master.component';
import { BuyerProfileComponent } from './features/buyer-profile/buyer-profile.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { ProductModule } from './modules/product/product.module';
import { ComingSoonComponent } from './features/coming-soon/coming-soon.component';
import { OrderConfirmationComponent } from './features/order-confirmation/order-confirmation.component';
import { ForgotPasswordComponent } from './features/forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    CarouselComponent,
    CartComponent,
    CartitemComponent,
    Page404Component,
    SearchresultComponent,
    SearchComponent,
    ProductMasterComponent,
    BuyerProfileComponent,
    WishlistComponent,
    ComingSoonComponent,
    OrderConfirmationComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
    ProductModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthinterceptorService,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
