"use strict";
(self["webpackChunkecommerce"] = self["webpackChunkecommerce"] || []).push([["main"],{

/***/ 158:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppRoutingModule": () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _core_components_home_home_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/components/home/home.component */ 8804);
/* harmony import */ var _core_components_login_login_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/components/login/login.component */ 7847);
/* harmony import */ var _core_components_register_register_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/components/register/register.component */ 2629);
/* harmony import */ var _core_components_cart_cart_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/components/cart/cart.component */ 6766);
/* harmony import */ var _core_components_page404_page404_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/components/page404/page404.component */ 7999);
/* harmony import */ var _modules_product_components_checkout_checkout_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/product/components/checkout/checkout.component */ 101);
/* harmony import */ var _shared_services_auth_authguard_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shared/services/auth/authguard.service */ 1588);
/* harmony import */ var _core_components_searchresult_searchresult_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./core/components/searchresult/searchresult.component */ 9342);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 2560);











const routes = [{
  path: '',
  component: _core_components_home_home_component__WEBPACK_IMPORTED_MODULE_0__.HomeComponent
}, {
  path: 'login',
  component: _core_components_login_login_component__WEBPACK_IMPORTED_MODULE_1__.LoginComponent
  // canActivate:[canActivate]
}, {
  path: 'register',
  component: _core_components_register_register_component__WEBPACK_IMPORTED_MODULE_2__.RegisterComponent
  // canActivate:[canActivate]
}, {
  path: 'products',
  component: _core_components_searchresult_searchresult_component__WEBPACK_IMPORTED_MODULE_7__.SearchresultComponent
}, {
  path: 'categories',
  loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_modules_product_product_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./modules/product/product.module */ 4324)).then(m => m.ProductModule)
}, {
  path: 'shopping-cart',
  component: _core_components_cart_cart_component__WEBPACK_IMPORTED_MODULE_3__.CartComponent
}, {
  path: 'checkout',
  component: _modules_product_components_checkout_checkout_component__WEBPACK_IMPORTED_MODULE_5__.CheckoutComponent,
  canActivate: [_shared_services_auth_authguard_service__WEBPACK_IMPORTED_MODULE_6__.canActivate]
}, {
  path: '**',
  component: _core_components_page404_page404_component__WEBPACK_IMPORTED_MODULE_4__.Page404Component,
  data: {
    message: 'Oops... This is a Bad request'
  }
}];
class AppRoutingModule {
  static {
    this.ɵfac = function AppRoutingModule_Factory(t) {
      return new (t || AppRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineNgModule"]({
      type: AppRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule.forRoot(routes, {
        preloadingStrategy: _angular_router__WEBPACK_IMPORTED_MODULE_9__.PreloadAllModules
      }), _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsetNgModuleScope"](AppRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule]
  });
})();

/***/ }),

/***/ 5041:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppComponent": () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _core_layout_components_header_header_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/layout/components/header/header.component */ 2630);
/* harmony import */ var _core_layout_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/layout/components/footer/footer.component */ 7386);




class AppComponent {
  constructor() {
    this.title = '24x7';
  }
  static {
    this.ɵfac = function AppComponent_Factory(t) {
      return new (t || AppComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: AppComponent,
      selectors: [["app-root"]],
      decls: 5,
      vars: 0,
      consts: [[1, "app-container"], [1, "px-2", "lg:px-10", "mx-auto", "h-full"]],
      template: function AppComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "app-header");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "main", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "router-outlet");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](4, "app-footer");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterOutlet, _core_layout_components_header_header_component__WEBPACK_IMPORTED_MODULE_0__.HeaderComponent, _core_layout_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_1__.FooterComponent],
      styles: ["main[_ngcontent-%COMP%] {\n  min-height: 100vh;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0ksaUJBQUE7QUFBSiIsInNvdXJjZXNDb250ZW50IjpbIlxubWFpbiB7XG4gICAgbWluLWhlaWdodDogMTAwdmg7XG59Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 6747:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppModule": () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/platform-browser */ 4497);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/common/http */ 8987);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 158);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 5041);
/* harmony import */ var _core_layout_components_header_header_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/layout/components/header/header.component */ 2630);
/* harmony import */ var _core_layout_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/layout/components/footer/footer.component */ 7386);
/* harmony import */ var _core_components_login_login_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/components/login/login.component */ 7847);
/* harmony import */ var _core_components_register_register_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./core/components/register/register.component */ 2629);
/* harmony import */ var _core_components_home_home_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./core/components/home/home.component */ 8804);
/* harmony import */ var _core_components_home_carousel_carousel_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./core/components/home/carousel/carousel.component */ 4289);
/* harmony import */ var _core_components_cart_cart_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./core/components/cart/cart.component */ 6766);
/* harmony import */ var _core_components_cart_cartitem_cartitem_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./core/components/cart/cartitem/cartitem.component */ 9003);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/forms */ 2508);
/* harmony import */ var _core_components_page404_page404_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./core/components/page404/page404.component */ 7999);
/* harmony import */ var _core_components_searchresult_searchresult_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./core/components/searchresult/searchresult.component */ 9342);
/* harmony import */ var _core_layout_components_header_search_search_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./core/layout/components/header/search/search.component */ 5797);
/* harmony import */ var _shared_services_auth_authinterceptor_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./shared/services/auth/authinterceptor.service */ 5724);
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./shared/shared.module */ 4466);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/core */ 2560);



















class AppModule {
  static {
    this.ɵfac = function AppModule_Factory(t) {
      return new (t || AppModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdefineNgModule"]({
      type: AppModule,
      bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent]
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdefineInjector"]({
      providers: [{
        provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_16__.HTTP_INTERCEPTORS,
        useClass: _shared_services_auth_authinterceptor_service__WEBPACK_IMPORTED_MODULE_13__.AuthinterceptorService,
        multi: true
      }],
      imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_17__.BrowserModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_16__.HttpClientModule, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.ReactiveFormsModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _shared_shared_module__WEBPACK_IMPORTED_MODULE_14__.SharedModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent, _core_layout_components_header_header_component__WEBPACK_IMPORTED_MODULE_2__.HeaderComponent, _core_layout_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_3__.FooterComponent, _core_components_login_login_component__WEBPACK_IMPORTED_MODULE_4__.LoginComponent, _core_components_register_register_component__WEBPACK_IMPORTED_MODULE_5__.RegisterComponent, _core_components_home_home_component__WEBPACK_IMPORTED_MODULE_6__.HomeComponent, _core_components_home_carousel_carousel_component__WEBPACK_IMPORTED_MODULE_7__.CarouselComponent, _core_components_cart_cart_component__WEBPACK_IMPORTED_MODULE_8__.CartComponent, _core_components_cart_cartitem_cartitem_component__WEBPACK_IMPORTED_MODULE_9__.CartitemComponent, _core_components_page404_page404_component__WEBPACK_IMPORTED_MODULE_10__.Page404Component, _core_components_searchresult_searchresult_component__WEBPACK_IMPORTED_MODULE_11__.SearchresultComponent, _core_layout_components_header_search_search_component__WEBPACK_IMPORTED_MODULE_12__.SearchComponent],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_17__.BrowserModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_16__.HttpClientModule, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.ReactiveFormsModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _shared_shared_module__WEBPACK_IMPORTED_MODULE_14__.SharedModule]
  });
})();

/***/ }),

/***/ 6766:
/*!********************************************************!*\
  !*** ./src/app/core/components/cart/cart.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CartComponent": () => (/* binding */ CartComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _services_cart_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/cart.service */ 4128);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 4666);
/* harmony import */ var _cartitem_cartitem_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cartitem/cartitem.component */ 9003);





const _c0 = function () {
  return ["/"];
};
function CartComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "section", 5)(1, "div", 6)(2, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "i", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "h4", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "NO ITEMS IN CART");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "a", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, " Go to Shopping ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](1, _c0));
  }
}
function CartComponent_div_6_app_cartitem_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "app-cartitem", 34);
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("item", item_r4);
  }
}
function CartComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 11)(1, "article", 12)(2, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, CartComponent_div_6_app_cartitem_3_Template, 1, 1, "app-cartitem", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "div", 15)(5, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, "Total : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "span", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "article", 18)(12, "div", 19)(13, "div", 20)(14, "label", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](15, "ENTER PROMO CODE");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](17, "input", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](18, "button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](19, "Submit");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "div")(21, "div", 25)(22, "div", 26)(23, "div")(24, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](25, "Shipping Cost");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](26, "div", 28)(27, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](28, "\u20B90.00");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](29, "div", 26)(30, "div")(31, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](32, "Discount");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](33, "div", 28)(34, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](35, "\u20B90.00");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "div", 26)(37, "div")(38, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](39, "GST(18%)");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](40, "div", 28)(41, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](42);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](43, "div", 29)(44, "div")(45, "span", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](46, "Estimated Total");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](47, "div", 28)(48, "span", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](49);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](50, "div", 31)(51, "button", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CartComponent_div_6_Template_button_click_51_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r6);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r5.goToCheckout());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](52, "i", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](53, " Checkout ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r2.cart);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("Items: ", ctx_r2.cart.length, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("\u20B9", ctx_r2.total, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](32);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r2.gstAmount);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("\u20B9", ctx_r2.estimatedTotal, "");
  }
}
class CartComponent {
  constructor(cartService, router) {
    this.cartService = cartService;
    this.router = router;
    this.cart = [];
    this.gstRate = 0.18;
    this.shippingCost = 0;
  }
  ngOnInit() {
    this.getCart();
    this.getTotal();
  }
  getCart() {
    this.cart = this.cartService.getCart;
  }
  getTotal() {
    this.total = this.cartService.getTotal();
    this.subsTotal = this.cartService.totalAmount.subscribe(data => this.total = parseInt(data.toFixed(2)));
    this.subsGST = this.cartService.gstAmount.subscribe(data => this.gstAmount = parseInt(data.toFixed(2)));
    this.subsEstimatedTotal = this.cartService.estimatedTotal.subscribe(data => this.estimatedTotal = parseInt(data.toFixed(2)));
  }
  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
  unsubscribeSubject() {
    this.subsTotal.unsubscribe();
    this.subsGST.unsubscribe();
    this.subsEstimatedTotal.unsubscribe();
  }
  ngOnDestroy() {
    this.unsubscribeSubject();
  }
  static {
    this.ɵfac = function CartComponent_Factory(t) {
      return new (t || CartComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_cart_service__WEBPACK_IMPORTED_MODULE_0__.CartService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: CartComponent,
      selectors: [["app-cart"]],
      decls: 7,
      vars: 2,
      consts: [[1, "border-blue-500"], [1, "text-3xl", "font-semibold", "text-gray-700", "text-center", "mb-3"], ["title", "Shopping Cart", 1, "fa-solid", "fa-bag-shopping", "mr-2"], ["empty", ""], ["class", "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 h-full", 4, "ngIf", "ngIfElse"], [1, "flex", "justify-center", "items-center", "h-[60vh]"], [1, "text-gray-500", "flex", "flex-col", "justify-center", "items-center"], [1, "text-4xl"], [1, "fa-solid", "fa-bag-shopping"], [1, "text-2xl", "px-4", "py-2"], [1, "px-4", "py-2", "mt-5", "bg-gray-800", "text-white", 3, "routerLink"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "lg:grid-cols-3", "gap-6", "h-full"], [1, "col-span-1", "md:col-span-2", "lg:col-span-2"], [1, "border-y-2", "border-gray-300", "overflow-y-auto", "h-[480px]", "p-2"], [3, "item", 4, "ngFor", "ngForOf"], [1, "flex", "justify-between", "pt-3"], [1, "text-lg", "font-semibold"], [1, "ml-4"], [1, "col-span-1", "md:col-span-1", "lg:col-span-1", "mb-4"], [1, "flex", "flex-col"], [1, "flex-1"], ["for", "promo-code", 1, "font-semibold", "text-gray-600"], [1, "flex", "flex-1", "sm:flex-col", "lg:flex-row", "border", "border-gray-600"], ["type", "text", "name", "promo-code", 1, "p-4", "w-full"], ["type", "submit", 1, "px-8", "py-4", "lg:px-16", "text-center", "text-white", "bg-gray-800"], [1, "mt-8"], [1, "flex", "justify-between", "pb-3"], [1, "text-xl", "text-gray-600"], [1, "text-right"], [1, "flex", "justify-between", "pt-8"], [1, "text-2xl", "font-semibold"], [1, "flex", "justify-center", "mt-60"], ["type", "submit", 1, "w-[80%]", "px-16", "lg:px-20", "py-4", "text-center", "font-semibold", "text-white", "bg-[#3c64a9]", 3, "click"], [1, "fa-solid", "fa-lock", "mr-2"], [3, "item"]],
      template: function CartComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "section", 0)(1, "h3", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "i", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, " My Cart ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, CartComponent_ng_template_4_Template, 8, 2, "ng-template", null, 3, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, CartComponent_div_6_Template, 54, 5, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.cart.length > 0)("ngIfElse", _r0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink, _cartitem_cartitem_component__WEBPACK_IMPORTED_MODULE_1__.CartitemComponent],
      styles: ["[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 0px;\n}\n\n[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: rgba(136, 136, 136, 0.281);\n}\n\n\n[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: #555;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29yZS9jb21wb25lbnRzL2NhcnQvY2FydC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0ksbUJBQUE7QUFDRjtFQUNFLFVBQUE7QUFBSjs7QUFFRTtFQUNFLHNDQUFBO0FBQ0o7O0FBQ0Usb0JBQUE7QUFDQTtFQUNFLGdCQUFBO0FBRUoiLCJzb3VyY2VzQ29udGVudCI6WyJcbiAgICAvKiBoaWRlIHNjcm9sbGJhciAqL1xuICA6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICB3aWR0aDogMHB4O1xuICB9XG4gIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMTM2LCAxMzYsIDEzNiwgMC4yODEpO1xuICB9XG4gIC8qIEhhbmRsZSBvbiBob3ZlciAqL1xuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiAjNTU1O1xuICB9XG4gICAgIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 9003:
/*!*********************************************************************!*\
  !*** ./src/app/core/components/cart/cartitem/cartitem.component.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CartitemComponent": () => (/* binding */ CartitemComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var src_app_core_services_cart_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/cart.service */ 4128);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 4666);



function CartitemComponent_p_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("Size: ", ctx_r0.item && ctx_r0.item.size, "");
  }
}
function CartitemComponent_span_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r1.item.stock);
  }
}
function CartitemComponent_span_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r2.item.stock);
  }
}
class CartitemComponent {
  constructor(cartService) {
    this.cartService = cartService;
    this.img = 'https://firebasestorage.googleapis.com/v0/b/ecomm-store-22.appspot.com/o/assets%2Fimages%2F29.jpg?alt=media&token=aef10446-375d-493b-b2d5-5a8c64548346';
  }
  removeFromCart(product) {
    this.cartService.remove(product);
    this.cartService.getTotal();
  }
  addQty(product) {
    this.cartService.addQty(product);
    this.cartService.getTotal();
  }
  lessQty(product) {
    this.cartService.lessQty(product);
    this.cartService.getTotal();
  }
  static {
    this.ɵfac = function CartitemComponent_Factory(t) {
      return new (t || CartitemComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](src_app_core_services_cart_service__WEBPACK_IMPORTED_MODULE_0__.CartService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: CartitemComponent,
      selectors: [["app-cartitem"]],
      inputs: {
        item: "item"
      },
      decls: 38,
      vars: 13,
      consts: [[1, "grid", "grid-cols-3", "lg:grid-cols-5", "bg-white", "gap-2", "border-b-2", "p-2"], [1, "col-span-1", "lg:col-span-1"], [1, "relative", "flex", "flex-row", "justify-between", "mx-auto", "md:flex-col", "max-w-sm"], [1, "rounded-t-lg", 3, "src", "alt"], [1, "col-span-2", "lg:col-span-2", "pt-2", "pr-2"], [1, "font-semibold", "text-gray-700", "text-ellipsis", "overflow-hidden", "whitespace-nowrap", 3, "title"], [1, "text-sm", "text-gray-700", "text-ellipsis", "overflow-hidden", "whitespace-nowrap", 3, "title"], ["class", "text-sm", 4, "ngIf"], [1, "text-sm"], [1, "text-gray-700", "mr-2"], ["class", "font-semibold text-green-700", 4, "ngIf"], ["class", "font-semibold text-yellow-700", 4, "ngIf"], [1, "font-semibold"], [1, "flex", "justify-start", "items-center", "mt-4"], ["aria-label", "less quantity", 1, "px-4", "py-1", "bg-gray-800", "text-white", 3, "click"], [1, "fa-solid", "fa-minus"], [1, "py-1", "w-[40px]", "text-center"], ["aria-label", "add quantity", 1, "px-4", "py-1", "bg-gray-800", "text-white", 3, "click"], [1, "fa-solid", "fa-plus"], [1, "col-span-3", "lg:col-span-2", "flex", "justify-between", "flex-1", "lg:items-end", "flex-row", "lg:flex-col", "gap-2"], [1, "order-2", "lg:order-1", "text-right"], [1, "font-semibold", "text-gray-700"], [1, ""], [1, "text-lg", "text-green-700", "font-semibold"], [1, "action", "text-sm", "order-1", "lg:order-2"], [1, "px-3", "py-1", "m-3", "font-semibold", "bg-gray-300", 3, "click"], [1, "fa-solid", "fa-trash"], [1, "px-3", "py-1", "m-3", "font-semibold", "bg-gray-300"], [1, "fa-solid", "fa-heart"], [1, "font-semibold", "text-green-700"], [1, "font-semibold", "text-yellow-700"]],
      template: function CartitemComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "img", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 4)(5, "p", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "p", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](9, CartitemComponent_p_9_Template, 2, 1, "p", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "p", 8)(11, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](13, CartitemComponent_span_13_Template, 2, 1, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](14, CartitemComponent_span_14_Template, 2, 1, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "p", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "div", 13)(18, "button", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function CartitemComponent_Template_button_click_18_listener() {
            return ctx.lessQty(ctx.item);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](19, "i", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "span", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "button", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function CartitemComponent_Template_button_click_22_listener() {
            return ctx.addQty(ctx.item);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](23, "i", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "div", 19)(25, "div", 20)(26, "p", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](27, "Total");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "div", 22)(29, "span", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "div", 24)(32, "button", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function CartitemComponent_Template_button_click_32_listener() {
            return ctx.removeFromCart(ctx.item);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](33, "i", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](34, " Remove ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "button", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](36, "i", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](37, " Save ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ctx.item.images[0], _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"])("alt", ctx.item.title);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("title", ctx.item.title);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.item.title, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("title", ctx.item.description);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.item.description, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.item.size);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("Product: ", ctx.item.type, "");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.item.stock == "In stock");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.item.stock == "Out of stock");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("\u20B9", ctx.item.price, "");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.item.qty);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("\u20B9", ctx.item.totalprice, "");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 4289:
/*!*********************************************************************!*\
  !*** ./src/app/core/components/home/carousel/carousel.component.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CarouselComponent": () => (/* binding */ CarouselComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 4666);


const _c0 = ["sliderRef"];
function CarouselComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const image_r3 = ctx.$implicit;
    const index_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", image_r3, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"])("alt", index_r4);
  }
}
function CarouselComponent_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CarouselComponent_button_5_Template_button_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8);
      const index_r6 = restoredCtx.$implicit;
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r7.selectSlide(index_r6));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
class CarouselComponent {
  constructor() {
    this.selectedSlide = 0;
  }
  selectSlide(index) {
    this.selectedSlide = index;
  }
  onPrev() {
    let width = this.sliderRef.nativeElement.clientWidth;
    this.sliderRef.nativeElement.scrollLeft = this.sliderRef.nativeElement.scrollLeft - width;
  }
  onNext() {
    let width = this.sliderRef.nativeElement.clientWidth;
    this.sliderRef.nativeElement.scrollLeft = this.sliderRef.nativeElement.scrollLeft + width;
  }
  ngOnInit() {}
  static {
    this.ɵfac = function CarouselComponent_Factory(t) {
      return new (t || CarouselComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: CarouselComponent,
      selectors: [["app-carousel"]],
      viewQuery: function CarouselComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c0, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.sliderRef = _t.first);
        }
      },
      inputs: {
        slideImages: "slideImages"
      },
      decls: 18,
      vars: 2,
      consts: [[1, "relative", "w-full"], [1, "relative", "h-40", "overflow-hidden", "rounded-lg", "md:h-96"], ["sliderRef", ""], ["class", "duration-700 ease-in-out", 4, "ngFor", "ngForOf"], [1, "absolute", "z-30", "flex", "space-x-3", "-translate-x-1/2", "bottom-5", "left-1/2"], ["type", "button", "class", "w-8 h-2  bg-gray-300", "aria-current", "true", "aria-label", "'Slide'+index", 3, "click", 4, "ngFor", "ngForOf"], ["type", "button", 1, "absolute", "top-0", "left-0", "z-30", "flex", "items-center", "justify-center", "h-full", "px-4", "cursor-pointer", "group", "focus:outline-none", 3, "click"], [1, "inline-flex", "items-center", "justify-center", "w-10", "h-10", "rounded-full", "bg-white/30", "dark:bg-gray-800/30", "group-hover:bg-white/50", "dark:group-hover:bg-gray-800/60", "group-focus:ring-4", "group-focus:ring-white", "dark:group-focus:ring-gray-800/70", "group-focus:outline-none"], ["aria-hidden", "true", "xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 6 10", 1, "w-4", "h-4", "text-white", "dark:text-gray-800"], ["stroke", "currentColor", "stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M5 1 1 5l4 4"], [1, "sr-only"], ["type", "button", 1, "absolute", "top-0", "right-0", "z-30", "flex", "items-center", "justify-center", "h-full", "px-4", "cursor-pointer", "group", "focus:outline-none", 3, "click"], ["stroke", "currentColor", "stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "m1 9 4-4-4-4"], [1, "duration-700", "ease-in-out"], [1, "absolute", "block", "w-full", "-translate-x-1/2", "-translate-y-1/2", "top-1/2", "left-1/2", 3, "src", "alt"], ["type", "button", "aria-current", "true", "aria-label", "'Slide'+index", 1, "w-8", "h-2", "bg-gray-300", 3, "click"]],
      template: function CarouselComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1, 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, CarouselComponent_div_3_Template, 2, 2, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, CarouselComponent_button_5_Template, 1, 0, "button", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "button", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CarouselComponent_Template_button_click_6_listener() {
            return ctx.onPrev();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "span", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "svg", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "path", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Previous");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CarouselComponent_Template_button_click_12_listener() {
            return ctx.onNext();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "span", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "svg", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "path", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Next");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.slideImages);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.slideImages);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 8804:
/*!********************************************************!*\
  !*** ./src/app/core/components/home/home.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HomeComponent": () => (/* binding */ HomeComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var src_app_modules_product_services_product_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/modules/product/services/product.service */ 2420);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 4666);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _shared_widgets_skeleton_cardskeleton_cardskeleton_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../shared/widgets/skeleton/cardskeleton/cardskeleton.component */ 7135);
/* harmony import */ var _carousel_carousel_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./carousel/carousel.component */ 4289);






function HomeComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 6)(1, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "i", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "h4", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "HTTP ERROR Occured");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
}
function HomeComponent_div_6_app_cardskeleton_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "app-cardskeleton");
  }
}
function HomeComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, HomeComponent_div_6_app_cardskeleton_1_Template, 1, 0, "app-cardskeleton", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r1.skeletons);
  }
}
function HomeComponent_div_7_div_1_span_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const product_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", product_r6.stock, " ");
  }
}
function HomeComponent_div_7_div_1_ng_template_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const product_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", product_r6.stock, " ");
  }
}
const _c0 = function (a2) {
  return ["categories", "product", a2];
};
function HomeComponent_div_7_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 13)(1, "a", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "img", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 16)(4, "a", 17)(5, "h5", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "p", 19)(8, "span", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "span", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](13, HomeComponent_div_7_div_1_span_13_Template, 2, 1, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](14, HomeComponent_div_7_div_1_ng_template_14_Template, 2, 1, "ng-template", null, 24, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](17, "i", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const product_r6 = ctx.$implicit;
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction1"](9, _c0, product_r6.id));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("src", product_r6.images[0], _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsanitizeUrl"])("alt", product_r6.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction1"](11, _c0, product_r6.id));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](product_r6.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("\u20B9", product_r6.price, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"]("\u20B9", product_r6.prevprice, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", product_r6.stock == "In stock")("ngIfElse", _r8);
  }
}
function HomeComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, HomeComponent_div_7_div_1_Template, 18, 13, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx_r2.products);
  }
}
class HomeComponent {
  constructor(_productService) {
    this._productService = _productService;
    this.products = [];
    this.skeletons = [...new Array(6)];
    this.isLoading = false;
    this.images = [
    // "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    // "https://www.creativefabrica.com/wp-content/uploads/2021/05/15/Quote-T-shirt-design-001-Graphics-12041380-1.jpg",
    // "https://www.apetogentleman.com/wp-content/uploads/2022/10/graphic-tees-men-1.jpg",
    "https://www.jiomart.com/images/cms/aw_rbslider/slides/1690561566_Fresh_Deals_on_Atta_and_Flours_Desktop.jpg?im=Resize=(1680,320)", "https://www.jiomart.com/images/cms/aw_rbslider/slides/1690405709_Month_End_Deals_On_Daily_Essentails_Desktop.jpg?im=Resize=(1680,320)", "https://www.jiomart.com/images/cms/aw_rbslider/slides/1690561220_bestsellingsmartphonesdesktop_D.jpg?im=Resize=(1680,320)", "https://www.jiomart.com/images/cms/aw_rbslider/slides/1688753500_1680x320rounded.jpg?im=Resize=(1680,320)"];
  }
  ngOnInit() {
    this.newArrivalProducts();
  }
  newArrivalProducts() {
    this.isLoading = true;
    const startIndex = Math.round(Math.random() * 20);
    const lastIndex = startIndex + 6;
    this._productService.get.subscribe(data => {
      this.isLoading = false;
      this.products = data.slice(startIndex, lastIndex);
    }, error => this.error = error.message);
  }
  static {
    this.ɵfac = function HomeComponent_Factory(t) {
      return new (t || HomeComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_modules_product_services_product_service__WEBPACK_IMPORTED_MODULE_0__.ProductService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: HomeComponent,
      selectors: [["app-home"]],
      decls: 8,
      vars: 4,
      consts: [[1, "w-full", "flex-1"], [3, "slideImages"], [1, "mb-5"], [1, "text-2xl", "font-semibold", "mb-5"], ["class", "flex justify-center items-center h-[60vh]", 4, "ngIf"], ["class", "grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-5", 4, "ngIf"], [1, "flex", "justify-center", "items-center", "h-[60vh]"], [1, "text-red-500", "flex", "flex-col", "justify-center", "items-center"], [1, "fa-solid", "fa-circle-exclamation", "text-6xl"], [1, "text-md", "px-4", "py-2"], [1, "grid", "grid-cols-1", "md:grid-cols-4", "lg:grid-cols-6", "gap-5"], [4, "ngFor", "ngForOf"], ["class", "relative flex flex-row justify-between mx-auto md:flex-col w-full max-w-md bg-white hover:border border-gray-300", 4, "ngFor", "ngForOf"], [1, "relative", "flex", "flex-row", "justify-between", "mx-auto", "md:flex-col", "w-full", "max-w-md", "bg-white", "hover:border", "border-gray-300"], [1, "w-[50%]", "sm:w-[40%]", "md:w-full", "overflow-hidden", 3, "routerLink"], [1, "transition-all", "duration-500", "hover:scale-110", 3, "src", "alt"], [1, "flex", "flex-col", "justify-stretch", "self-center", "p-5", "w-[60%]", "md:w-full"], [3, "routerLink"], [1, "mb-2", "text-sm", "tracking-tight", "text-gray-900", "dark:text-white"], [1, "text-sm", "text-gray-700", "dark:text-gray-400"], [1, "font-bold", "mr-3"], [1, "line-through", "mr-3"], [1, "absolute", "top-2", "left-5", "md:right-5", "flex", "justify-end", "gap-4", "items-center"], ["class", "w-[80px] bg-green-600 text-white text-center text-xs p-1 rounded", 4, "ngIf", "ngIfElse"], ["outofstock", ""], ["aria-label", "add to wishlist", "title", "Add to Wishlist", 1, "bg-white", "border", "border-gray-300", "rounded", "h-[35px]", "w-[35px]"], [1, "fa-regular", "fa-heart"], [1, "w-[80px]", "bg-green-600", "text-white", "text-center", "text-xs", "p-1", "rounded"], [1, "w-[80px]", "bg-yellow-600", "text-white", "text-center", "text-xs", "p-1", "rounded"]],
      template: function HomeComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "section", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "app-carousel", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "article", 2)(3, "h3", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "NEW ARRIVALS");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](5, HomeComponent_div_5_Template, 5, 0, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](6, HomeComponent_div_6_Template, 2, 1, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, HomeComponent_div_7_Template, 2, 1, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("slideImages", ctx.images);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.error && ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.error && ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.isLoading && ctx.products.length > 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterLink, _shared_widgets_skeleton_cardskeleton_cardskeleton_component__WEBPACK_IMPORTED_MODULE_1__.CardskeletonComponent, _carousel_carousel_component__WEBPACK_IMPORTED_MODULE_2__.CarouselComponent],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 7847:
/*!**********************************************************!*\
  !*** ./src/app/core/components/login/login.component.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LoginComponent": () => (/* binding */ LoginComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 2508);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 228);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 8951);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var src_app_shared_services_auth_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/services/auth/auth.service */ 6256);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 4666);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 124);








function LoginComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx_r0.errorMessage, " ");
  }
}
const _c0 = function () {
  return ["/register"];
};
class LoginComponent {
  // Custom validator to accept both email and plain username
  emailOrUsernameValidator(control) {
    const value = control.value;
    if (!value) {
      return null;
    }
    // Check if it's a valid email OR a plain username (at least 3 characters)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(value);
    const isValidUsername = value.length >= 3 && /^[a-zA-Z0-9_.]+$/.test(value);
    return isValidEmail || isValidUsername ? null : {
      invalidEmailOrUsername: true
    };
  }
  constructor(formBuilder, authService) {
    this.formBuilder = formBuilder;
    this.authService = authService;
    this.isLoading = false;
    this.errorMessage = '';
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
    this.loginForm = this.formBuilder.group({
      email: new _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControl('', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required, this.emailOrUsernameValidator.bind(this)]),
      password: new _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControl('', [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.minLength(6)])
    });
    // Clear error message when user starts typing
    this.loginForm.valueChanges.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this.destroy$)).subscribe(() => {
      this.errorMessage = '';
    });
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter a valid email/username and password (min. 6 characters)';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    this.authService.login(credentials).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this.destroy$)).subscribe({
      next: response => {
        this.isLoading = false;
        if (response.success) {
          // Navigation is handled in AuthService
          this.loginForm.reset();
        } else {
          this.errorMessage = response.message || 'Login failed. Please try again.';
        }
      },
      error: error => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  static {
    this.ɵfac = function LoginComponent_Factory(t) {
      return new (t || LoginComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](src_app_shared_services_auth_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: LoginComponent,
      selectors: [["app-login"]],
      decls: 23,
      vars: 6,
      consts: [[1, "mt-5", "p-3", "max-w-[430px]", "min-w-[380px]", "mx-auto", "bg-white", "shadow-lg", "rounded-lg"], [1, "py-4", "text-gray-700", "text-xl", "text-center", "font-semibold", "border-b"], [1, "mt-5"], ["class", "mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded", 4, "ngIf"], [3, "formGroup", "ngSubmit"], [1, "mb-6"], ["for", "email", 1, "block", "mb-2", "text-sm", "font-medium", "text-gray-900", "dark:text-white"], ["type", "text", "id", "email", "formControlName", "email", "placeholder", "administrator or email@domain.com", "required", "", 1, "shadow-sm", "bg-gray-50", "border", "border-gray-300", "text-gray-900", "text-sm", "focus:ring-gray-500", "focus:border-gray-500", "block", "w-full", "p-2.5", "outline-none", "dark:bg-gray-700", "dark:border-gray-600", "dark:placeholder-gray-400", "dark:text-white", "dark:focus:ring-gray-500", "focus:border-2", "dark:focus:border-gray-500", "dark:shadow-sm-light"], ["for", "password", 1, "block", "mb-2", "text-sm", "font-medium", "text-gray-900", "dark:text-white"], ["type", "password", "id", "password", "formControlName", "password", "required", "", 1, "shadow-sm", "bg-gray-50", "border", "border-gray-300", "text-gray-900", "text-sm", "focus:ring-gray-500", "focus:border-gray-500", "block", "w-full", "p-2.5", "outline-none", "dark:bg-gray-700", "dark:border-gray-600", "dark:placeholder-gray-400", "dark:text-white", "dark:focus:ring-gray-500", "focus:border-2", "dark:focus:border-gray-500", "dark:shadow-sm-light"], [1, "flex", "justify-between", "items-start", "mb-6"], ["href", "#", 1, "text-sm", "font-medium", "text-gray-600", "hover:underline", "dark:text-gray-500"], ["type", "submit", 1, "text-white", "bg-[#3c64a9]", "hover:bg-[#3c64a9]", "focus:ring-4", "focus:outline-none", "focus:ring-[#3c64a9]-300", "font-medium", "text-sm", "px-5", "py-3", "text-center", "dark:bg-gray-600", "dark:hover:bg-gray-700", "dark:focus:ring-gray-800", "w-full", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "disabled"], [1, "mt-4", "text-sm"], [1, "text-gray-600", "hover:underline", "dark:text-gray-500", 3, "routerLink"], [1, "mb-4", "p-3", "bg-red-100", "border", "border-red-400", "text-red-700", "rounded"]],
      template: function LoginComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "h4", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Login");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, LoginComponent_div_4_Template, 2, 1, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "form", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function LoginComponent_Template_form_ngSubmit_5_listener() {
            return ctx.onSubmit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 5)(7, "label", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Email or Username");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](9, "input", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 5)(11, "label", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Password");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](13, "input", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "div", 10)(15, "a", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Forgot password?");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "button", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "p", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, " Not a member? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "a", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, "Register");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.errorMessage);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.loginForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", ctx.isLoading ? "Logging in..." : "Login", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](5, _c0));
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterLink],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 7999:
/*!**************************************************************!*\
  !*** ./src/app/core/components/page404/page404.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Page404Component": () => (/* binding */ Page404Component)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 124);


class Page404Component {
  constructor(route) {
    this.route = route;
  }
  ngOnInit() {
    this.errorMessage = this.route.snapshot.data['message'];
    this.route.data.subscribe(data => {
      this.errorMessage = data['message'];
    });
  }
  static {
    this.ɵfac = function Page404Component_Factory(t) {
      return new (t || Page404Component)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__.ActivatedRoute));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: Page404Component,
      selectors: [["app-page404"]],
      decls: 8,
      vars: 1,
      consts: [[1, "flex", "flex-col", "justify-center", "items-center", "h-screen"], [1, "flex", "flex-col", "justify-center", "items-center", "h-screen", "w-[80%]", "h-[60%]", "md:w-[60%]", "md:h-full"], [1, "text-5xl", "font-bold"], [1, "text-3xl", "my-3"], ["href", "/", 1, "px-4", "py-2", "mt-5", "bg-gray-800", "text-white"]],
      template: function Page404Component_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h2", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "404 | Not found");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "p", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "a", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Go to Home");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.errorMessage);
        }
      },
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 2629:
/*!****************************************************************!*\
  !*** ./src/app/core/components/register/register.component.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RegisterComponent": () => (/* binding */ RegisterComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 2508);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 124);



const _c0 = function () {
  return ["/login"];
};
class RegisterComponent {
  static {
    this.ɵfac = function RegisterComponent_Factory(t) {
      return new (t || RegisterComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: RegisterComponent,
      selectors: [["app-register"]],
      decls: 39,
      vars: 2,
      consts: [[1, "mt-5", "p-3", "max-w-[430px]", "min-w-[380px]", "mx-auto", "bg-white", "shadow-lg"], [1, "py-4", "text-gray-700", "text-xl", "text-center", "font-semibold", "border-b"], [1, "mt-5"], [1, "flex", "flex-col", "md:flex-row"], [1, "mb-6"], ["for", "firstname", 1, "block", "mb-2", "text-sm", "font-medium", "text-gray-900", "dark:text-white"], ["type", "text", "id", "firstname", "placeholder", "David", "required", "", 1, "shadow-sm", "bg-gray-50", "border", "border-gray-300", "text-gray-900", "text-sm", "focus:ring-gray-500", "focus:border-gray-500", "block", "w-full", "p-2.5", "outline-none", "dark:bg-gray-700", "dark:border-gray-600", "dark:placeholder-gray-400", "dark:text-white", "dark:focus:ring-gray-500", "focus:border-2", "dark:focus:border-gray-500", "dark:shadow-sm-light"], ["for", "lastname", 1, "block", "mb-2", "text-sm", "font-medium", "text-gray-900", "dark:text-white"], ["type", "text", "id", "lastname", "placeholder", "Paul", "required", "", 1, "shadow-sm", "bg-gray-50", "border", "border-gray-300", "text-gray-900", "text-sm", "focus:ring-gray-500", "focus:border-gray-500", "block", "w-full", "p-2.5", "outline-none", "dark:bg-gray-700", "dark:border-gray-600", "dark:placeholder-gray-400", "dark:text-white", "dark:focus:ring-gray-500", "focus:border-2", "dark:focus:border-gray-500", "dark:shadow-sm-light"], ["for", "email", 1, "block", "mb-2", "text-sm", "font-medium", "text-gray-900", "dark:text-white"], ["type", "email", "id", "email", "placeholder", "davidpaul@test.com", "required", "", 1, "shadow-sm", "bg-gray-50", "border", "border-gray-300", "text-gray-900", "text-sm", "focus:ring-gray-500", "focus:border-gray-500", "block", "w-full", "p-2.5", "outline-none", "dark:bg-gray-700", "dark:border-gray-600", "dark:placeholder-gray-400", "dark:text-white", "dark:focus:ring-gray-500", "focus:border-2", "dark:focus:border-gray-500", "dark:shadow-sm-light"], ["for", "password", 1, "block", "mb-2", "text-sm", "font-medium", "text-gray-900", "dark:text-white"], ["type", "password", "id", "password", "required", "", 1, "shadow-sm", "bg-gray-50", "border", "border-gray-300", "text-gray-900", "text-sm", "focus:ring-gray-500", "focus:border-gray-500", "block", "w-full", "p-2.5", "outline-none", "dark:bg-gray-700", "dark:border-gray-600", "dark:placeholder-gray-400", "dark:text-white", "dark:focus:ring-gray-500", "focus:border-2", "dark:focus:border-gray-500", "dark:shadow-sm-light"], ["for", "repeat-password", 1, "block", "mb-2", "text-sm", "font-medium", "text-gray-900", "dark:text-white"], ["type", "password", "id", "repeat-password", "required", "", 1, "shadow-sm", "bg-gray-50", "border", "border-gray-300", "text-gray-900", "text-sm", "focus:ring-gray-500", "focus:border-gray-500", "block", "w-full", "p-2.5", "outline-none", "dark:bg-gray-700", "dark:border-gray-600", "dark:placeholder-gray-400", "dark:text-white", "dark:focus:ring-gray-500", "focus:border-2", "dark:focus:border-gray-500", "dark:shadow-sm-light"], [1, "flex", "items-start", "mb-6"], [1, "flex", "items-center", "h-5"], ["id", "terms", "type", "checkbox", "value", "", "required", "", 1, "w-4", "h-4", "border", "border-gray-300", "rounded", "bg-gray-50", "focus:ring-3", "focus:ring-gray-300", "dark:bg-gray-700", "dark:border-gray-600", "dark:focus:ring-gray-600", "dark:ring-offset-gray-800", "dark:focus:ring-offset-gray-800"], ["for", "terms", 1, "ml-2", "text-sm", "font-medium", "text-gray-900", "dark:text-gray-300"], ["href", "#", 1, "text-gray-600", "hover:underline", "dark:text-gray-500"], ["type", "submit", 1, "text-white", "bg-[#3c64a9]", "hover:bg-[#3c64a9]", "focus:ring-4", "focus:outline-none", "focus:ring-[#3c64a9]-300", "font-medium", "text-sm", "px-5", "py-3", "text-center", "dark:bg-gray-600", "dark:hover:bg-gray-700", "dark:focus:ring-gray-800", "w-full"], [1, "mt-4", "text-sm"], [1, "text-gray-600", "hover:underline", "dark:text-gray-500", 3, "routerLink"]],
      template: function RegisterComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "h4", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Register");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2)(4, "form")(5, "div", 3)(6, "div", 4)(7, "label", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "First Name");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](9, "input", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 4)(11, "label", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Last Name");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "input", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 4)(15, "label", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "Email");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "input", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 4)(19, "label", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Password");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](21, "input", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 4)(23, "label", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Repeat password");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](25, "input", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "div", 15)(27, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](28, "input", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "label", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "I agree with the ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "a", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, "terms and conditions");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "button", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "Register ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "p", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, " Already a member ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "a", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "Login");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](37);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](1, _c0));
        }
      },
      dependencies: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgForm, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLink],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 9342:
/*!************************************************************************!*\
  !*** ./src/app/core/components/searchresult/searchresult.component.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SearchresultComponent": () => (/* binding */ SearchresultComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var src_app_modules_product_services_product_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/modules/product/services/product.service */ 2420);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 4666);
/* harmony import */ var _shared_widgets_skeleton_product_skeleton_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../shared/widgets/skeleton/product/skeleton.component */ 2859);





function SearchresultComponent_section_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "section", 5)(1, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "i", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "h4", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "HTTP ERROR Occured");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
}
function SearchresultComponent_app_skeleton_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "app-skeleton");
  }
}
function SearchresultComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "section", 5)(1, "div", 9)(2, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "svg", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](4, "path", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "h4", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "NO RESULTS");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
}
function SearchresultComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 13)(1, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "svg", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "path", 16)(4, "path", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Loading...");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
}
function SearchresultComponent_section_5_div_9_span_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const product_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", product_r7.stock, " ");
  }
}
function SearchresultComponent_section_5_div_9_ng_template_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const product_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", product_r7.stock, " ");
  }
}
const _c0 = function (a2) {
  return ["/categories", "product", a2];
};
const _c1 = function (a0, a1) {
  return {
    "rounded-t-lg transition-all duration-500 hover:scale-110 grayscale": a0,
    "rounded-t-lg transition-all duration-500 hover:scale-110": a1
  };
};
function SearchresultComponent_section_5_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 27)(1, "a", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "img", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 30)(4, "a", 31)(5, "h5", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "p", 33)(8, "span", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "p", 36)(13, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](14, "i", 37)(15, "i", 37)(16, "i", 37)(17, "i", 37)(18, "i", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "span", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](22, SearchresultComponent_section_5_div_9_span_22_Template, 2, 1, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](23, SearchresultComponent_section_5_div_9_ng_template_23_Template, 2, 1, "ng-template", null, 42, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](25, "button", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](26, "i", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const product_r7 = ctx.$implicit;
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](11, _c0, product_r7.id));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](13, _c1, product_r7.stock == "Out of stock", product_r7.stock == "In stock"))("src", product_r7.images[0], _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeUrl"])("alt", product_r7.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](16, _c0, product_r7.id));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](product_r7.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("\u20B9", product_r7.price, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("\u20B9", product_r7.prevprice, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("(", product_r7.rating.count, ")");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", product_r7.stock == "In stock")("ngIfElse", _r9);
  }
}
function SearchresultComponent_section_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "section", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "aside", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "article", 21)(3, "div", 22)(4, "h4", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Search results: for ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](9, SearchresultComponent_section_5_div_9_Template, 27, 18, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r5.searchKeyword);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r5.products);
  }
}
class SearchresultComponent {
  constructor(productService, route) {
    this.productService = productService;
    this.route = route;
    this.products = [];
    this.isLoading = false;
  }
  ngOnInit() {
    this.getResults();
  }
  getResults() {
    this.isLoading = true;
    this.route.queryParams.subscribe(params => {
      this.searchKeyword = params['q'];
      this.productService.search(params['q']).subscribe(data => {
        this.isLoading = false;
        this.products = data;
      }, error => this.error = error.message);
    });
  }
  static {
    this.ɵfac = function SearchresultComponent_Factory(t) {
      return new (t || SearchresultComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_modules_product_services_product_service__WEBPACK_IMPORTED_MODULE_0__.ProductService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.ActivatedRoute));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: SearchresultComponent,
      selectors: [["app-searchresult"]],
      decls: 6,
      vars: 5,
      consts: [["class", "flex justify-center items-center h-[60vh]", 4, "ngIf"], [4, "ngIf"], ["empty", ""], ["class", "flex justify-center items-center h-screen", 4, "ngIf"], ["class", "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 bg-white", 4, "ngIf", "ngIfElse"], [1, "flex", "justify-center", "items-center", "h-[60vh]"], [1, "text-red-500", "flex", "flex-col", "justify-center", "items-center"], [1, "fa-solid", "fa-circle-exclamation", "text-6xl"], [1, "text-md", "px-4", "py-2"], [1, "text-gray-500", "flex", "flex-col", "justify-center", "items-center"], [1, ""], ["viewBox", "0 0 1024 1024", "version", "1.1", "xmlns", "http://www.w3.org/2000/svg", 1, "svg-icon", 2, "height", "4rem", "width", "4rem", "vertical-align", "middle", "fill", "currentColor", "overflow", "hidden"], ["d", "M504.1 452.5c-18.3 0-36.5-4.1-50.7-10.1l-280.1-138c-18.3-10.1-30.4-24.4-30.4-40.6 0-16.2 10.2-32.5 30.4-42.6L455.4 77.1c16.2-8.1 34.5-12.2 54.8-12.2 18.3 0 36.5 4.1 50.7 10.1L841 213c18.3 10.1 30.4 24.4 30.4 40.6 0 16.2-10.1 32.5-30.4 42.6L558.9 440.3c-16.3 8.1-34.5 12.2-54.8 12.2zM193.6 261.7l280.1 138c8.1 4.1 18.3 6.1 30.4 6.1 12.2 0 24.4-2 32.5-6.1l284.1-144.1-280.1-138c-8.1-4.1-18.3-6.1-30.4-6.1-12.2 0-24.4 2-32.5 6.1L193.6 261.7z m253.6 696.1c-10.1 0-20.3-2-30.4-8.1L165.1 817.8c-30.4-14.2-52.8-46.7-52.8-73.1V391.6c0-24.4 18.3-42.6 44.6-42.6 10.1 0 20.3 2 30.4 8.1L437.1 489c30.4 14.2 52.8 46.7 52.8 73.1v353.1c0 24.4-18.3 42.6-42.7 42.6z m-10.1-48.7c2 2 4.1 2 6.1 2v-349c0-8.1-10.1-24.4-26.4-32.5L165.1 397.7c-2-2-4.1-2-6.1-2v349.1c0 8.1 10.2 24.4 26.4 32.5l251.7 131.8z m144.1 48.7c-24.4 0-42.6-18.3-42.6-42.6V562.1c0-26.4 22.3-58.9 52.8-73.1L841 357.1c10.1-4.1 20.3-8.1 30.4-8.1 24.4 0 42.6 18.3 42.6 42.6v353.1c0 26.4-22.3 58.9-52.8 73.1L611.6 949.7c-12.2 6.1-20.3 8.1-30.4 8.1z m280-560.1L611.6 529.6c-16.2 8.1-26.4 24.4-26.4 32.5v349.1c2 0 4.1-2 6.1-2l249.6-131.9c16.2-8.1 26.4-24.4 26.4-32.5V395.7c-2 0-4 2-6.1 2z m0 0"], [1, "flex", "justify-center", "items-center", "h-screen"], ["role", "status"], ["aria-hidden", "true", "viewBox", "0 0 100 101", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "inline", "w-12", "h-12", "mr-2", "text-gray-200", "animate-spin", "dark:text-gray-600", "fill-blue-600"], ["d", "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", "fill", "currentColor"], ["d", "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", "fill", "currentFill"], [1, "sr-only"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "lg:grid-cols-4", "bg-white"], [1, "col-span-1", "md:col-span-1", "lg:col-span-1", "mb-4"], [1, "col-span-1", "md:col-span-2", "lg:col-span-3"], [1, "mb-4"], [1, "text-gray-500", "font-semibold"], [1, "text-gray-800"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "gap-4"], ["class", "relative flex flex-row justify-between mx-auto md:flex-col w-full max-w-md bg-white hover:border border-gray-300", 4, "ngFor", "ngForOf"], [1, "relative", "flex", "flex-row", "justify-between", "mx-auto", "md:flex-col", "w-full", "max-w-md", "bg-white", "hover:border", "border-gray-300"], [1, "w-[50%]", "sm:w-[40%]", "md:w-full", "overflow-hidden", 3, "routerLink"], [3, "ngClass", "src", "alt"], [1, "flex", "flex-col", "justify-stretch", "self-center", "p-5", "w-[60%]", "md:w-full"], [3, "routerLink"], [1, "mb-2", "font-semibold", "text-sm", "tracking-tight", "text-gray-900", "dark:text-white"], [1, "text-sm", "text-gray-700", "dark:text-gray-400"], [1, "font-bold", "mr-3"], [1, "line-through", "mr-3"], [1, "flex", "items-center"], [1, "fa-solid", "fa-star"], [1, "fa-regular", "fa-star"], [1, "ml-2", "text-xs"], [1, "absolute", "top-2", "left-5", "md:right-5", "flex", "justify-end", "gap-4", "items-center"], ["class", "w-[80px] bg-green-600 text-white text-center text-xs p-1 rounded", 4, "ngIf", "ngIfElse"], ["outofstock", ""], ["aria-label", "add to wishlist", "title", "Add to Wishlist", 1, "bg-white", "border", "border-gray-300", "rounded", "h-[35px]", "w-[35px]"], [1, "fa-regular", "fa-heart"], [1, "w-[80px]", "bg-green-600", "text-white", "text-center", "text-xs", "p-1", "rounded"], [1, "w-[80px]", "bg-yellow-600", "text-white", "text-center", "text-xs", "p-1", "rounded"]],
      template: function SearchresultComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, SearchresultComponent_section_0_Template, 5, 0, "section", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, SearchresultComponent_app_skeleton_1_Template, 1, 0, "app-skeleton", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, SearchresultComponent_ng_template_2_Template, 7, 0, "ng-template", null, 2, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, SearchresultComponent_div_4_Template, 7, 0, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, SearchresultComponent_section_5_Template, 10, 2, "section", 4);
        }
        if (rf & 2) {
          const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx.error && ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.products.length > 0 && !ctx.isLoading)("ngIfElse", _r2);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink, _shared_widgets_skeleton_product_skeleton_component__WEBPACK_IMPORTED_MODULE_1__.SkeletonComponent],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 7386:
/*!*******************************************************************!*\
  !*** ./src/app/core/layout/components/footer/footer.component.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FooterComponent": () => (/* binding */ FooterComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2560);

class FooterComponent {
  constructor() {
    this.brandlogo = 'https://www.pngkey.com/png/detail/361-3617936_b2b-e-commerce-b2b-e-commerce-icon.png';
    this.year = new Date().getFullYear();
    this.brand = 'Sale24x7';
  }
  static {
    this.ɵfac = function FooterComponent_Factory(t) {
      return new (t || FooterComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: FooterComponent,
      selectors: [["app-footer"]],
      decls: 70,
      vars: 2,
      consts: [[1, "bg-gray-200", "dark:bg-gray-900"], [1, "mx-auto", "w-full", "max-w-screen-xl", "p-4", "py-6", "lg:py-8"], [1, "md:flex", "md:justify-between"], [1, "mb-6", "md:mb-0"], ["href", "https://www.preeshe.com/", 1, "flex", "flex-col", "items-center"], ["src", "assets/images/logo.png", "alt", "brand", 1, "w-[40px]"], [1, "text-sm", "font-semibold", "text-white", "bg-[#3c64a9]", "px-3", "rounded", "rotate-6"], [1, "grid", "grid-cols-2", "gap-8", "sm:gap-6", "sm:grid-cols-3"], [1, "mb-6", "text-sm", "font-semibold", "text-gray-900", "uppercase", "dark:text-white"], [1, "text-gray-500", "dark:text-gray-400"], [1, "mb-4"], ["href", "https://www.preeshe.com", 1, "hover:underline"], ["href", "https://tailwindcss.com/", 1, "hover:underline"], ["href", "https://github.com/shekharpriyadarshi", 1, "hover:underline"], ["href", "#", 1, "hover:underline"], [1, "my-6", "border-gray-200", "sm:mx-auto", "dark:border-gray-700", "lg:my-8"], [1, "flex", "flex-col", "justify-center", "md:flex-row", "md:items-center", "md:justify-between"], [1, "text-sm", "text-gray-500", "text-center", "dark:text-gray-400"], [1, "flex", "justify-center", "mt-4", "space-x-5", "sm:mt-2"], ["href", "#", 1, "text-gray-500", "hover:text-gray-900", "dark:hover:text-white"], ["aria-hidden", "true", "xmlns", "http://www.w3.org/2000/svg", "fill", "currentColor", "viewBox", "0 0 8 19", 1, "w-4", "h-4"], ["fill-rule", "evenodd", "d", "M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z", "clip-rule", "evenodd"], [1, "sr-only"], ["aria-hidden", "true", "xmlns", "http://www.w3.org/2000/svg", "fill", "currentColor", "viewBox", "0 0 21 16", 1, "w-4", "h-4"], ["d", "M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"], ["aria-hidden", "true", "xmlns", "http://www.w3.org/2000/svg", "fill", "currentColor", "viewBox", "0 0 20 17", 1, "w-4", "h-4"], ["fill-rule", "evenodd", "d", "M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z", "clip-rule", "evenodd"], ["aria-hidden", "true", "xmlns", "http://www.w3.org/2000/svg", "fill", "currentColor", "viewBox", "0 0 20 20", 1, "w-4", "h-4"], ["fill-rule", "evenodd", "d", "M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z", "clip-rule", "evenodd"], ["fill-rule", "evenodd", "d", "M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z", "clip-rule", "evenodd"]],
      template: function FooterComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "footer", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "a", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "img", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "span", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, " Sales24x7 ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 7)(9, "div")(10, "h2", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Resources");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "ul", 9)(13, "li", 10)(14, "a", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Preeshe");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "a", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div")(19, "h2", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Follow us");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "ul", 9)(22, "li", 10)(23, "a", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Github");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "li")(26, "a", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Discord");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div")(29, "h2", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](30, "Legal");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "ul", 9)(32, "li", 10)(33, "a", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, "Privacy Policy");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "li")(36, "a", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, "Terms & Conditions");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](38, "hr", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "div", 16)(40, "span", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "span", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, "Designed and Developed by Preeshe Consultancy Services. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "div", 18)(45, "a", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "svg", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](47, "path", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "span", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49, "Facebook page");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "a", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "svg", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](52, "path", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "span", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](54, "Discord community");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "a", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "svg", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](57, "path", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "span", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](59, "Twitter page");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](60, "a", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "svg", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](62, "path", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "span", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](64, "GitHub account");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](65, "a", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](66, "svg", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](67, "path", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](68, "span", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](69, "Dribbble account");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](41);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("\u00A9 ", ctx.year, " All Rights Reserved. ", ctx.brand, ". ");
        }
      },
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 2630:
/*!*******************************************************************!*\
  !*** ./src/app/core/layout/components/header/header.component.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HeaderComponent": () => (/* binding */ HeaderComponent)
/* harmony export */ });
/* harmony import */ var src_app_shared_constant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/constant */ 9648);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var src_app_core_services_cart_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/cart.service */ 4128);
/* harmony import */ var src_app_shared_services_auth_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/services/auth/auth.service */ 6256);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 4666);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _search_search_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./search/search.component */ 5797);







function HeaderComponent_span_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r0.cart.length, " ");
  }
}
const _c0 = function () {
  return ["/login"];
};
function HeaderComponent_li_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "li", 8)(1, "a", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "i", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "span", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "Login");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](1, _c0));
  }
}
function HeaderComponent_li_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "li", 8)(1, "button", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function HeaderComponent_li_21_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r7);
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r6.logOut());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "i", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "span", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "Logout");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
}
const _c1 = function (a0) {
  return [a0];
};
const _c2 = function () {
  return ["active-link"];
};
function HeaderComponent_li_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "li", 33)(1, "a", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const menu_r8 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](4, _c1, menu_r8.path))("routerLinkActive", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](6, _c2));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵattribute"]("aria-label", menu_r8.title + " " + "link");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", menu_r8.title, " ");
  }
}
function HeaderComponent_div_29_li_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "li", 33)(1, "a", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function HeaderComponent_div_29_li_6_Template_a_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r12);
      const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r11.closeMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const menu_r10 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](4, _c1, menu_r10.path))("routerLinkActive", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](6, _c2));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵattribute"]("aria-label", menu_r10.title + " " + "link");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", menu_r10.title, " ");
  }
}
function HeaderComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 35)(1, "div", 36)(2, "button", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function HeaderComponent_div_29_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r14);
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r13.closeMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, " CLOSE ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](4, "i", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "ul", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, HeaderComponent_div_29_li_6_Template, 3, 7, "li", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r4.menulist);
  }
}
function HeaderComponent_li_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "li", 41)(1, "a", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const menu_r15 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](4, _c1, menu_r15.path))("routerLinkActive", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](6, _c2));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵattribute"]("aria-label", menu_r15.title + " " + "link");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", menu_r15.title, " ");
  }
}
const _c3 = function () {
  return ["/wishlist"];
};
const _c4 = function () {
  return ["/shopping-cart"];
};
class HeaderComponent {
  constructor(cartService, authService) {
    this.cartService = cartService;
    this.authService = authService;
    this.cart = [];
    this.menulist = src_app_shared_constant__WEBPACK_IMPORTED_MODULE_0__.MENU;
    this.isMenu = false;
  }
  openMenu() {
    this.isMenu = true;
  }
  closeMenu() {
    this.isMenu = false;
  }
  logOut() {
    this.authService.logout();
  }
  ngOnInit() {
    this.cart = this.cartService.getCart;
  }
  static {
    this.ɵfac = function HeaderComponent_Factory(t) {
      return new (t || HeaderComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_core_services_cart_service__WEBPACK_IMPORTED_MODULE_1__.CartService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_shared_services_auth_auth_service__WEBPACK_IMPORTED_MODULE_2__.AuthService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
      type: HeaderComponent,
      selectors: [["app-header"]],
      decls: 36,
      vars: 10,
      consts: [[1, "mb-4"], [1, "px-2", "md:px-6", "lg:px-10", "md:py-2"], [1, "flex", "justify-between", "items-center", "pt-2", "md:pt-0"], ["routerLink", "/", 1, "flex", "flex-col", "items-center", "cursor-pointer"], ["src", "assets/images/logo.png", "alt", "brand", 1, "w-[40px]", "md:w-[50px]"], [1, "text-sm", "font-semibold", "text-white", "bg-[#3c64a9]", "px-3", "rounded", "rotate-6", "hidden", "md:block"], [1, ""], [1, "top-nav-menu"], [1, "top-nav-menu-item"], [1, "mr-4", "py-1", "flex-col", "md:flex-row", 3, "routerLink"], ["title", "Wishlist", 1, "fa-regular", "fa-heart"], [1, "md:hidden", "text-xs"], [1, "relative", "mr-4", "py-1", "flex-col", "md:flex-row", 3, "routerLink"], ["title", "Shopping Cart", 1, "fa-solid", "fa-bag-shopping"], ["class", "absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-gray-800 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900", 4, "ngIf"], ["class", "top-nav-menu-item", 4, "ngIf"], [1, "mt-6", "border-b", "border-gray-300", "hidden", "md:block"], [1, "bottom-nav-menu", "text-md", "uppercase"], ["class", "bottom-nav-menu-item", 4, "ngFor", "ngForOf"], [1, "flex", "justify-end", "items-center", "px-1", "md:px-10", "w-full"], [1, "block", "md:hidden", "flex", "items-center", "gap-2", "mr-2", "cursor-pointer", 3, "click"], [1, "fa-sharp", "fa-solid", "fa-bars", "text-md"], ["class", "fixed top-0 left-0 w-[350px] z-[99] h-full drop-shadow-lg bg-white block md:hidden", 4, "ngIf"], [1, "relative", "md:mb-4", "w-full", "md:w-[300px]", "transition-all", "duration-300", "bg-transparent", "focus-within:w-full", "border-2", "focus-within:border-gray-600", "rounded"], [1, "mt-2", "border-b", "border-gray-300", "md:hidden"], [1, "flex", "justify-start", "flex-wrap", "text-xs", "uppercase", "px-2"], ["class", "my-2", 4, "ngFor", "ngForOf"], [1, "absolute", "inline-flex", "items-center", "justify-center", "w-6", "h-6", "text-xs", "font-bold", "text-white", "bg-gray-800", "border-2", "border-white", "rounded-full", "-top-2", "-right-2", "dark:border-gray-900"], [1, "py-1", "flex-col", "md:flex-row", 3, "routerLink"], ["title", "Login", 1, "fa-regular", "fa-user"], [1, "py-1", "flex-col", "md:flex-row", 3, "click"], ["title", "Logout", 1, "fa-solid", "fa-arrow-right-from-bracket"], [1, "text-xs"], [1, "bottom-nav-menu-item"], [1, "px-2", "py-1", "transition-all", "duration-900", 3, "routerLink", "routerLinkActive"], [1, "fixed", "top-0", "left-0", "w-[350px]", "z-[99]", "h-full", "drop-shadow-lg", "bg-white", "block", "md:hidden"], [1, "h-full"], [1, "absolute", "right-4", "flex", "items-center", 3, "click"], [1, "fa-solid", "fa-xmark", "text-xl"], [1, "pt-12", "flex", "flex-col", "gap-5", "text-md", "uppercase"], [1, "px-4", "py-1", "border-b-2", "block", "hover:pl-12", "transition-all", "duration-1000", 3, "routerLink", "routerLinkActive", "click"], [1, "my-2"], [1, "px-1", "py-1", "transition-all", "duration-900", 3, "routerLink", "routerLinkActive"]],
      template: function HeaderComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "header", 0)(1, "nav", 1)(2, "div", 2)(3, "a", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](4, "img", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, " Sale24x7 ");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "div", 6)(8, "ul", 7)(9, "li", 8)(10, "a", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](11, "i", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "Wishlist");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "li", 8)(15, "a", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](16, "i", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18, "Cart");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](19, HeaderComponent_span_19_Template, 2, 1, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](20, HeaderComponent_li_20_Template, 5, 2, "li", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](21, HeaderComponent_li_21_Template, 5, 0, "li", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](22, "div", 16)(23, "ul", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](24, HeaderComponent_li_24_Template, 3, 7, "li", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](25, "div", 19)(26, "div", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function HeaderComponent_Template_div_click_26_listener() {
            return ctx.openMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](27, "i", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](28, " MENU ");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](29, HeaderComponent_div_29_Template, 7, 1, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](30, "div", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](31, "app-search");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](32, "nav")(33, "div", 24)(34, "ul", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](35, HeaderComponent_li_35_Template, 3, 7, "li", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](8, _c3));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction0"](9, _c4));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.cart.length > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx.authService.isLoggedIn());
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.authService.isLoggedIn());
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.menulist);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.isMenu);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.menulist);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterLinkActive, _search_search_component__WEBPACK_IMPORTED_MODULE_3__.SearchComponent],
      styles: [".top-nav-menu[_ngcontent-%COMP%], .bottom-nav-menu[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n\n.top-nav-menu-item[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], .top-nav-menu-item[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 4px;\n  font-size: 1.3rem;\n  text-transform: uppercase;\n  transition: all 0.5s;\n}\n\n.bottom-nav-menu-item[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  font-weight: 600;\n  border-bottom: 4px solid #374151;\n}\n\n.active-link[_ngcontent-%COMP%] {\n  font-weight: 600;\n  border-bottom: 4px solid #374151;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29yZS9sYXlvdXQvY29tcG9uZW50cy9oZWFkZXIvaGVhZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDSTs7RUFFRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0FBQU47O0FBR0k7O0VBRUUsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0VBQ0EsaUJBQUE7RUFDQSx5QkFBQTtFQUNBLG9CQUFBO0FBQU47O0FBRUk7RUFDRSxnQkFBQTtFQUNBLGdDQUFBO0FBQ047O0FBRUk7RUFDRSxnQkFBQTtFQUNBLGdDQUFBO0FBQ04iLCJzb3VyY2VzQ29udGVudCI6WyJcbiAgICAudG9wLW5hdi1tZW51LFxuICAgIC5ib3R0b20tbmF2LW1lbnUge1xuICAgICAgZGlzcGxheTpmbGV4O1xuICAgICAgYWxpZ24taXRlbXM6Y2VudGVyO1xuICAgICAgZ2FwOjVweDtcblxuICAgIH1cbiAgICAudG9wLW5hdi1tZW51LWl0ZW0gYSxcbiAgICAudG9wLW5hdi1tZW51LWl0ZW0gYnV0dG9uIHtcbiAgICAgIGRpc3BsYXk6ZmxleDtcbiAgICAgIGp1c3RpZnktY29udGVudDpjZW50ZXI7XG4gICAgICBhbGlnbi1pdGVtczpjZW50ZXI7XG4gICAgICBnYXA6NHB4O1xuICAgICAgZm9udC1zaXplOjEuM3JlbTtcbiAgICAgIHRleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtcbiAgICAgIHRyYW5zaXRpb246YWxsIDAuNXM7XG4gICAgfVxuICAgIC5ib3R0b20tbmF2LW1lbnUtaXRlbSBhOmhvdmVyIHtcbiAgICAgIGZvbnQtd2VpZ2h0OjYwMDtcbiAgICAgIGJvcmRlci1ib3R0b206NHB4IHNvbGlkICMzNzQxNTE7XG4gICAgfVxuXG4gICAgLmFjdGl2ZS1saW5rIHtcbiAgICAgIGZvbnQtd2VpZ2h0OjYwMDtcbiAgICAgIGJvcmRlci1ib3R0b206NHB4IHNvbGlkICMzNzQxNTE7XG4gICAgfVxuICAgICJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 5797:
/*!**************************************************************************!*\
  !*** ./src/app/core/layout/components/header/search/search.component.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SearchComponent": () => (/* binding */ SearchComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 124);


class SearchComponent {
  constructor(router) {
    this.router = router;
  }
  onKey(event, element) {
    if (event.keyCode === 13 && element.value !== '') {
      this.router.navigate(['/products'], {
        queryParams: {
          q: element.value.toLowerCase().trim()
        }
      });
    }
  }
  onSearch(element) {
    this.router.navigate(['/products?q=' + element.value]);
  }
  static {
    this.ɵfac = function SearchComponent_Factory(t) {
      return new (t || SearchComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: SearchComponent,
      selectors: [["app-search"]],
      inputs: {
        search: "search"
      },
      decls: 6,
      vars: 0,
      consts: [[1, "flex", "w-full"], ["id", "basic-addon2", 1, "input-group-text", "flex", "items-center", "whitespace-nowrap", "rounded", "bg-white", "px-3", "py-1.5", "text-center", "text-base", "font-normal", "text-neutral-700", "dark:text-neutral-200"], ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 0 20 20", "fill", "currentColor", 1, "h-5", "w-5"], ["fill-rule", "evenodd", "d", "M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z", "clip-rule", "evenodd"], ["type", "search", "name", "seach", "placeholder", "Search products...", "aria-label", "Search", 1, "relative", "m-0", "block", "w-[1px]", "min-w-0", "flex-auto", "focus:z-[3]", "p-2", "md:p-3", "outline-none", "rounded", "w-full", 3, "keydown"], ["search", ""]],
      template: function SearchComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "span", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "svg", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "path", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "input", 4, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("keydown", function SearchComponent_Template_input_keydown_4_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1);
            const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](5);
            return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx.onKey($event, _r0));
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        }
      },
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 4128:
/*!***********************************************!*\
  !*** ./src/app/core/services/cart.service.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CartService": () => (/* binding */ CartService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 6317);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2560);


class CartService {
  constructor() {
    this.cart = [];
    this.products = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject([]);
    this.totalAmount = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(0);
    this.gstAmount = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(0);
    this.estimatedTotal = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(0);
  }
  get getCart() {
    return this.cart;
  }
  add(product) {
    this.cart.push(product);
    this.updateQtyAndTotalPrice(product);
    this.products.next(this.cart);
  }
  remove(product) {
    this.cart.map((prod, index) => {
      if (product.id === prod.id) {
        this.cart.splice(index, 1);
      }
    });
    this.products.next(this.cart);
  }
  updateQtyAndTotalPrice(item) {
    const index = this.find(item);
    const products = this.getCart;
    let totalQty = products[index].qty = 1;
    totalQty = totalQty;
    let subTotal = products[index].price * totalQty;
    products[index].totalprice = subTotal;
  }
  find(item) {
    const products = this.getCart;
    const index = products.findIndex(prod => {
      return prod.id == item.id;
    });
    return index;
  }
  getTotal() {
    const total = this.cart.reduce((r, c) => r = r + c.totalprice, 0);
    const gstRate = 0.18;
    this.totalAmount.next(total);
    this.gstAmount.next(gstRate * total);
    this.estimatedTotal.next(total + this.gstAmount.value);
    return total;
  }
  addQty(item) {
    const products = this.getCart;
    let index = this.find(item);
    let totalQty = products[index].qty;
    if (totalQty !== 12) {
      totalQty = totalQty && totalQty + 1;
    }
    products[index].qty = totalQty;
    let subTotal = products[index].price * totalQty;
    products[index].totalprice = subTotal;
  }
  lessQty(item) {
    const products = this.getCart;
    let index = this.find(item);
    let totalQty = products[index].qty;
    if (totalQty !== 1) {
      totalQty = totalQty && totalQty - 1;
    }
    products[index].qty = totalQty;
    let subTotal = products[index].price * totalQty;
    products[index].totalprice = subTotal;
  }
  static {
    this.ɵfac = function CartService_Factory(t) {
      return new (t || CartService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: CartService,
      factory: CartService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 101:
/*!***************************************************************************!*\
  !*** ./src/app/modules/product/components/checkout/checkout.component.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CheckoutComponent": () => (/* binding */ CheckoutComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 2508);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var src_app_core_services_cart_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/cart.service */ 4128);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 4666);





function CheckoutComponent_p_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " * First name required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CheckoutComponent_p_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " * Last name must be atleast 3 characters long ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CheckoutComponent_p_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " * Email required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CheckoutComponent_p_54_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " * Mobile No. required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CheckoutComponent_p_75_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " * Address required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CheckoutComponent_p_81_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " * City required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CheckoutComponent_p_87_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " * State required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function CheckoutComponent_p_93_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "p", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " * Pin code required ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
class CheckoutComponent {
  constructor(cartService, formBulider) {
    this.cartService = cartService;
    this.formBulider = formBulider;
    this.shippingForm = this.formBulider.group({
      firstName: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl('', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.minLength(3), _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.maxLength(15)]),
      lastName: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl('', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.minLength(3), _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.maxLength(15)]),
      email: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl('', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.email]),
      mobile: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl('', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.minLength(10)]),
      address: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl('', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required]),
      city: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl('', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required]),
      state: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl('', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required]),
      country: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl('India', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required]),
      postalCode: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl('', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required])
    });
  }
  ngOnInit() {
    this.getTotal();
  }
  getTotal() {
    this.cartService.gstAmount.subscribe(data => this.gstAmount = parseInt(data.toFixed(2)));
    this.cartService.estimatedTotal.subscribe(data => this.grandTotal = parseInt(data.toFixed(2)));
  }
  get firstName() {
    return this.shippingForm.get('firstName');
  }
  get lastName() {
    return this.shippingForm.get('lastName');
  }
  get email() {
    return this.shippingForm.get('email');
  }
  get mobile() {
    return this.shippingForm.get('mobile');
  }
  get address() {
    return this.shippingForm.get('address');
  }
  get state() {
    return this.shippingForm.get('state');
  }
  get city() {
    return this.shippingForm.get('city');
  }
  get country() {
    return this.shippingForm.get('country');
  }
  get postalCode() {
    return this.shippingForm.get('postalCode');
  }
  onSave() {
    alert(JSON.stringify(this.shippingForm.value));
    this.shippingForm.reset();
  }
  static {
    this.ɵfac = function CheckoutComponent_Factory(t) {
      return new (t || CheckoutComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](src_app_core_services_cart_service__WEBPACK_IMPORTED_MODULE_0__.CartService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: CheckoutComponent,
      selectors: [["app-checkout"]],
      decls: 144,
      vars: 20,
      consts: [[1, "mb-12", "pt-2", "pb-8", "px-4", "bg-white"], [1, "text-3xl", "font-semibold", "text-gray-700", "text-center", "mb-3"], ["title", "Checkout", 1, "fa-solid", "fa-lock", "mr-2"], [1, "flex", "items-center", "w-full", "text-sm", "font-medium", "text-center", "text-gray-500", "dark:text-gray-400", "sm:text-base", "pb-5"], [1, "flex", "md:w-full", "items-center", "text-[#3c64a9]", "dark:text-[#3c64a9]", "sm:after:content-['']", "after:w-full", "after:h-1", "after:border-b", "after:border-gray-200", "after:border-1", "after:hidden", "sm:after:inline-block", "after:mx-6", "xl:after:mx-10", "dark:after:border-gray-700"], [1, "flex", "items-center", "after:content-['/']", "sm:after:hidden", "after:mx-2", "after:text-gray-200", "dark:after:text-gray-500"], ["aria-hidden", "true", "xmlns", "http://www.w3.org/2000/svg", "fill", "currentColor", "viewBox", "0 0 20 20", 1, "w-3.5", "h-3.5", "sm:w-4", "sm:h-4", "mr-2.5"], ["d", "M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"], [1, "hidden", "sm:inline-flex", "sm:ml-2"], [1, "flex", "md:w-full", "items-center", "after:content-['']", "after:w-full", "after:h-1", "after:border-b", "after:border-gray-200", "after:border-1", "after:hidden", "sm:after:inline-block", "after:mx-6", "xl:after:mx-10", "dark:after:border-gray-700"], [1, "mr-2"], [1, "flex", "items-center"], [1, "grid", "grid-cols-1", "lg:grid-cols-3", "gap-6", "h-full"], [1, "col-span-1", "lg:col-span-2", "md:pr-10"], [1, "text-2xl", "font-semibold", "leading-7", "text-gray-600"], [3, "formGroup", "ngSubmit"], [1, "space-y-12"], [1, "border-b", "border-gray-900/10", "pb-12"], [1, "mt-10", "grid", "grid-cols-1", "gap-x-6", "gap-y-8", "sm:grid-cols-6"], [1, "sm:col-span-3"], ["for", "firstName", 1, "block", "text-sm", "font-medium", "leading-6", "text-gray-900"], [1, "mt-2"], ["type", "text", "name", "firstName", "formControlName", "firstName", "id", "firstName", "autocomplete", "given-name", 3, "ngClass"], ["class", "text-sm text-red-400", 4, "ngIf"], ["for", "lastName", 1, "block", "text-sm", "font-medium", "leading-6", "text-gray-900"], ["type", "text", "name", "lastName", "formControlName", "lastName", "id", "lastName", "autocomplete", "lastName", 3, "ngClass"], [1, "sm:col-span-2"], ["for", "email", 1, "block", "text-sm", "font-medium", "leading-6", "text-gray-900"], ["type", "email", "id", "email", "name", "email", "formControlName", "email", "autocomplete", "email", 3, "ngClass"], ["for", "mobile", 1, "block", "text-sm", "font-medium", "leading-6", "text-gray-900"], ["type", "number", "name", "mobile", "id", "mobile", "formControlName", "mobile", "autocomplete", "mobile", 3, "ngClass"], ["for", "country", 1, "block", "text-sm", "font-medium", "leading-6", "text-gray-900"], ["id", "country", "name", "country", "formControlName", "country", "autocomplete", "country-name", 1, "block", "w-full", "border-0", "p-2.5", "text-gray-900", "shadow-sm", "ring-1", "ring-inset", "ring-gray-300", "focus:ring-inset", "focus:ring-gray-500", "sm:max-w-xs", "sm:text-sm", "sm:leading-6"], [1, "col-span-full"], ["for", "address", 1, "block", "text-sm", "font-medium", "leading-6", "text-gray-900"], ["type", "text", "name", "address", "formControlName", "address", "id", "address", "autocomplete", "address", 3, "ngClass"], [1, "sm:col-span-2", "sm:col-start-1"], ["for", "city", 1, "block", "text-sm", "font-medium", "leading-6", "text-gray-900"], ["type", "text", "name", "city", "id", "city", "formControlName", "city", "autocomplete", "city", 3, "ngClass"], ["for", "state", 1, "block", "text-sm", "font-medium", "leading-6", "text-gray-900"], ["type", "text", "name", "state", "id", "state", "formControlName", "state", "autocomplete", "state", 3, "ngClass"], ["for", "postalCode", 1, "block", "text-sm", "font-medium", "leading-6", "text-gray-900"], ["type", "number", "name", "postalCode", "formControlName", "postalCode", "id", "postalCode", "autocomplete", "postalCode", 3, "ngClass"], [1, "relative", "flex", "gap-x-3"], [1, "flex", "h-6", "items-center"], ["id", "comments", "name", "comments", "type", "checkbox", 1, "h-4", "w-4", "rounded", "border-gray-300", "accent-gray-700", "text-indigo-600", "focus:ring-indigo-600"], ["for", "comments", 1, "leading-6", "ml-2", "font-medium", "text-gray-900"], [1, "mt-1", "text-md", "leading-6", "text-gray-600"], [1, "mt-6", "flex", "items-center", "justify-end", "gap-x-6"], ["type", "button", 1, "text-sm", "font-semibold", "leading-6", "text-gray-900"], ["type", "submit", 1, "bg-gray-700", "px-12", "py-3", "text-sm", "font-semibold", "text-white", "shadow-sm", "hover:bg-gray-500", "focus-visible:outline", "focus-visible:outline-2", "focus-visible:outline-offset-2", "focus-visible:outline-gray-500", 3, "disabled"], [1, "col-span-1", "lg:col-span-1", "mb-4"], [1, "flex", "flex-col"], [1, "flex-1"], [1, "text-2xl", "font-semibold", "text-gray-600"], [1, "mt-8"], [1, "flex", "justify-between", "pb-3"], [1, "text-xl", "text-gray-600"], [1, "text-right"], [1, "flex", "justify-between", "pt-8"], [1, "text-2xl", "font-semibold"], [1, "flex", "justify-center", "mt-60"], ["type", "submit", 1, "w-[80%]", "px-16", "py-4", "text-center", "font-semibold", "text-white", "bg-[#3c64a9]"], [1, "fa-solid", "fa-lock", "mr-2"], [1, "text-sm", "text-red-400"]],
      template: function CheckoutComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "section", 0)(1, "h3", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "i", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, " Checkout ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "ol", 3)(5, "li", 4)(6, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "svg", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "path", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, " Shipping ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "Info");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "li", 9)(13, "span", 5)(14, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "2");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, " Payment ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "span", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "Method");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "li", 11)(20, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](21, "3");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, " Delivery ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "div", 12)(24, "article", 13)(25, "h2", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](26, "Billing Details");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "form", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function CheckoutComponent_Template_form_ngSubmit_27_listener() {
            return ctx.onSave();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "div", 16)(29, "div", 17)(30, "div", 18)(31, "div", 19)(32, "label", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](33, "First name");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](34, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](35, "input", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](36, CheckoutComponent_p_36_Template, 2, 0, "p", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "div", 19)(38, "label", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](39, "Last name");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](40, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](41, "input", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](42, CheckoutComponent_p_42_Template, 2, 0, "p", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](43, "div", 26)(44, "label", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](45, "Email address");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](47, "input", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](48, CheckoutComponent_p_48_Template, 2, 0, "p", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](49, "div", 26)(50, "label", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](51, "Mobile No.");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](52, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](53, "input", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](54, CheckoutComponent_p_54_Template, 2, 0, "p", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](55, "div", 26)(56, "label", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](57, "Country");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](58, "div", 21)(59, "select", 32)(60, "option");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](61, "India");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](62, "option");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](63, "Sri Lanka");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](64, "option");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](65, "Nepal");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](66, "option");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](67, "Bangladesh");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](68, "option");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](69, "Pakistan");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](70, "div", 33)(71, "label", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](72, "Street address");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](73, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](74, "input", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](75, CheckoutComponent_p_75_Template, 2, 0, "p", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](76, "div", 36)(77, "label", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](78, "City");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](79, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](80, "input", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](81, CheckoutComponent_p_81_Template, 2, 0, "p", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](82, "div", 26)(83, "label", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](84, "State");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](85, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](86, "input", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](87, CheckoutComponent_p_87_Template, 2, 0, "p", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](88, "div", 26)(89, "label", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](90, "PIN/ Postal code");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](91, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](92, "input", 42);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](93, CheckoutComponent_p_93_Template, 2, 0, "p", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](94, "div", 43)(95, "div", 44);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](96, "input", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](97, "label", 46)(98, "p", 47);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](99, " Use as permanent address ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](100, "div", 48)(101, "button", 49);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](102, " Cancel ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](103, "button", 50);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](104, " Save ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](105, "article", 51)(106, "div", 52)(107, "div", 53)(108, "h3", 54);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](109, "Order summary");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](110, "div")(111, "div", 55)(112, "div", 56)(113, "div")(114, "span", 57);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](115, "Shipping Cost");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](116, "div", 58)(117, "span", 57);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](118, "\u20B90.00");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](119, "div", 56)(120, "div")(121, "span", 57);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](122, "Discount");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](123, "div", 58)(124, "span", 57);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](125, "\u20B90.00");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](126, "div", 56)(127, "div")(128, "span", 57);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](129, "GST");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](130, "div", 58)(131, "span", 57);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](132);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](133, "div", 59)(134, "div")(135, "span", 60);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](136, "Order Total");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](137, "div", 58)(138, "span", 60);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](139);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](140, "div", 61)(141, "button", 62);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](142, "i", 63);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](143, " Place order ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](27);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.shippingForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ctx.firstName && ctx.firstName.invalid && ctx.firstName.touched ? "border border-red-400 block w-full p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6" : "block w-full  border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.firstName && ctx.firstName.invalid && ctx.firstName.touched);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ctx.lastName && ctx.lastName.invalid && ctx.lastName.touched ? "border border-red-400 block w-full p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6" : "block w-full  border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.lastName && ctx.lastName.invalid && ctx.lastName.touched);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ctx.email && ctx.email.invalid && ctx.email.touched ? "border border-red-400 block w-full p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6" : "block w-full border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.email && ctx.email.invalid && ctx.email.touched);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ctx.mobile && ctx.mobile.invalid && ctx.mobile.touched ? "border border-red-400 block w-full p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" : "block w-full border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.mobile && ctx.mobile.invalid && ctx.mobile.touched);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](20);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ctx.address && ctx.address.invalid && ctx.address.touched ? "border border-red-400 block w-full border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6" : "block w-full  border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.address && ctx.address.invalid && ctx.address.touched);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ctx.city && ctx.city.invalid && ctx.city.touched ? "border border-red-400 block w-full border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6" : "block w-full  border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.city && ctx.city.invalid && ctx.city.touched);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ctx.state && ctx.state.invalid && ctx.state.touched ? "border border-red-400 block w-full border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6" : "block w-full  border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.state && ctx.state.invalid && ctx.state.touched);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ctx.postalCode && ctx.postalCode.invalid && ctx.postalCode.touched ? "border border-red-400 block w-full  border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" : "block w-full  border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.postalCode && ctx.postalCode.invalid && ctx.postalCode.touched);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.shippingForm.invalid);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](29);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.gstAmount);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("\u20B9", ctx.grandTotal, "");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 2420:
/*!*************************************************************!*\
  !*** ./src/app/modules/product/services/product.service.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProductService": () => (/* binding */ ProductService)
/* harmony export */ });
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/environments/environment */ 2340);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ 8987);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 635);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 3158);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 5474);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 6317);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 2560);






class ProductService {
  constructor(http) {
    this.http = http;
    this.url = src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.baseAPIURL + src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.productsEndpoint;
    this.products = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject([]);
    this.ratingList = [];
  }
  get get() {
    return this.http.get(this.url).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(data => {
      // Handle both array and object responses
      if (Array.isArray(data)) {
        return data;
      } else {
        let newProducts = [];
        for (const key in data) {
          newProducts.push({
            ...data[key]
          });
        }
        return newProducts;
      }
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error('Error fetching products:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.throwError)(() => error);
    }));
  }
  getByCategory(category) {
    return this.http.get(this.url, {
      params: new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpParams().set('category', category)
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error('Error fetching products by category:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.throwError)(() => error);
    }));
  }
  getRelated(type) {
    return this.http.get(this.url, {
      params: new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpParams().set('type', type)
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error('Error fetching related products:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.throwError)(() => error);
    }));
  }
  getProduct(id) {
    return this.http.get(`${this.url}/${id}`).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error('Error fetching product:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.throwError)(() => error);
    }));
  }
  search(query) {
    return this.http.get(this.url, {
      params: new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpParams().set('q', query)
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error('Error searching products:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.throwError)(() => error);
    }));
  }
  getRatingStar(product) {
    this.ratingList = [];
    [...Array(5)].map((_, index) => {
      return index + 1 <= Math.trunc(product?.rating.rate) ? this.ratingList.push(true) : this.ratingList.push(false);
    });
    return this.ratingList;
  }
  static {
    this.ɵfac = function ProductService_Factory(t) {
      return new (t || ProductService)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjectable"]({
      token: ProductService,
      factory: ProductService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 9648:
/*!************************************!*\
  !*** ./src/app/shared/constant.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MENU": () => (/* binding */ MENU),
/* harmony export */   "breadcrumbsMenu": () => (/* binding */ breadcrumbsMenu)
/* harmony export */ });
const breadcrumbsMenu = [{
  label: 'Categories',
  path: '/categories',
  children: [{
    path: ':category'
  }, {
    path: '/product/:id'
  }]
}];
const MENU = [{
  title: 'Men',
  path: '/categories/Men'
}, {
  title: 'Women',
  path: '/categories/Women'
}, {
  title: 'Groceries',
  path: '/categories/Groceries'
}, {
  title: 'Packed Foods',
  path: '/categories/Packaged Foods'
}, {
  title: 'Beverages',
  path: '/categories/Beverages'
}, {
  title: 'Electronics',
  path: '/categories/Electronics'
}];

/***/ }),

/***/ 6256:
/*!******************************************************!*\
  !*** ./src/app/shared/services/auth/auth.service.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthService": () => (/* binding */ AuthService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 6317);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 5474);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 9337);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 3158);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/environments/environment */ 2340);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 124);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common/http */ 8987);






class AuthService {
  constructor(router, http) {
    this.router = router;
    this.http = http;
    this.authState = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject({
      isLoggedIn: this.checkStoredAuth(),
      token: localStorage.getItem('auth_token'),
      userId: localStorage.getItem('user_id'),
      email: localStorage.getItem('user_email')
    });
    this.authState$ = this.authState.asObservable();
    this.apiUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.baseAPIURL + src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.loginEndpoint;
  }
  /**
   * Login with email and password via API
   */
  login(credentials) {
    return this.http.post(this.apiUrl, credentials).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.tap)(response => {
      if (response.success) {
        // Store authentication data
        localStorage.setItem('isLogged', 'true');
        localStorage.setItem('user_email', credentials.email);
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        if (response.userId) {
          localStorage.setItem('user_id', response.userId.toString());
        }
        // Update auth state
        this.authState.next({
          isLoggedIn: true,
          token: response.token || null,
          userId: response.userId || null,
          email: credentials.email
        });
        // Navigate to home
        this.router.navigate(['/']);
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error('Login failed:', error);
      // Extract error message from response
      let errorMessage = 'Login failed. Please try again.';
      if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error?.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (error?.status === 429) {
        errorMessage = 'Too many login attempts. Please try again later.';
      }
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.throwError)(() => ({
        error: {
          message: errorMessage
        },
        status: error?.status
      }));
    }));
  }
  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('isLogged');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    this.authState.next({
      isLoggedIn: false,
      token: null,
      userId: null,
      email: null
    });
    this.router.navigate(['/login']);
  }
  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return !!localStorage.getItem('isLogged');
  }
  /**
   * Get stored authentication token
   */
  getToken() {
    return localStorage.getItem('auth_token');
  }
  /**
   * Get current user ID
   */
  getUserId() {
    return localStorage.getItem('user_id');
  }
  /**
   * Get current user email
   */
  getUserEmail() {
    return localStorage.getItem('user_email');
  }
  /**
   * Check if there's stored authentication data
   */
  checkStoredAuth() {
    return !!localStorage.getItem('isLogged');
  }
  static {
    this.ɵfac = function AuthService_Factory(t) {
      return new (t || AuthService)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({
      token: AuthService,
      factory: AuthService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 1588:
/*!***********************************************************!*\
  !*** ./src/app/shared/services/auth/authguard.service.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "canActivate": () => (/* binding */ canActivate)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 124);


const canActivate = (route, state) => {
  const router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_1__.Router);
  if (localStorage.getItem('isLogged')) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

/***/ }),

/***/ 5724:
/*!*****************************************************************!*\
  !*** ./src/app/shared/services/auth/authinterceptor.service.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthinterceptorService": () => (/* binding */ AuthinterceptorService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth.service */ 6256);


class AuthinterceptorService {
  constructor(authService) {
    this.authService = authService;
  }
  intercept(req, next) {
    // Get the token from AuthService
    const token = this.authService.getToken();
    // Clone the request and add auth header if token exists
    if (token) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }
    return next.handle(req);
  }
  static {
    this.ɵfac = function AuthinterceptorService_Factory(t) {
      return new (t || AuthinterceptorService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: AuthinterceptorService,
      factory: AuthinterceptorService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 4466:
/*!*****************************************!*\
  !*** ./src/app/shared/shared.module.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SharedModule": () => (/* binding */ SharedModule)
/* harmony export */ });
/* harmony import */ var _widgets_skeleton_product_skeleton_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./widgets/skeleton/product/skeleton.component */ 2859);
/* harmony import */ var _widgets_skeleton_cardskeleton_cardskeleton_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widgets/skeleton/cardskeleton/cardskeleton.component */ 7135);
/* harmony import */ var _widgets_skeleton_asideskeleton_asideskeleton_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./widgets/skeleton/asideskeleton/asideskeleton.component */ 7610);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 4666);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 2560);





class SharedModule {
  static {
    this.ɵfac = function SharedModule_Factory(t) {
      return new (t || SharedModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({
      type: SharedModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](SharedModule, {
    declarations: [_widgets_skeleton_cardskeleton_cardskeleton_component__WEBPACK_IMPORTED_MODULE_1__.CardskeletonComponent, _widgets_skeleton_asideskeleton_asideskeleton_component__WEBPACK_IMPORTED_MODULE_2__.AsideskeletonComponent, _widgets_skeleton_product_skeleton_component__WEBPACK_IMPORTED_MODULE_0__.SkeletonComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule],
    exports: [_widgets_skeleton_cardskeleton_cardskeleton_component__WEBPACK_IMPORTED_MODULE_1__.CardskeletonComponent, _widgets_skeleton_asideskeleton_asideskeleton_component__WEBPACK_IMPORTED_MODULE_2__.AsideskeletonComponent, _widgets_skeleton_product_skeleton_component__WEBPACK_IMPORTED_MODULE_0__.SkeletonComponent]
  });
})();

/***/ }),

/***/ 7610:
/*!**********************************************************************************!*\
  !*** ./src/app/shared/widgets/skeleton/asideskeleton/asideskeleton.component.ts ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AsideskeletonComponent": () => (/* binding */ AsideskeletonComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2560);

class AsideskeletonComponent {
  constructor() {
    this.skeletons = [...new Array(3)];
  }
  static {
    this.ɵfac = function AsideskeletonComponent_Factory(t) {
      return new (t || AsideskeletonComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AsideskeletonComponent,
      selectors: [["app-asideskeleton"]],
      decls: 8,
      vars: 0,
      consts: [[1, "mb-5"], [1, "text-sm", "font-semibold", "uppercase", "ml-3", "mb-3", "py-3"], [1, "h-3", "bg-gray-200", "dark:bg-gray-700", "w-32", "mb-2"], [1, "h-2", "bg-gray-200", "dark:bg-gray-700", "mb-2"], [1, "h-2.5", "bg-gray-200", "dark:bg-gray-700", "w-32", "mb-2"], [1, "w-48", "h-2", "bg-gray-200", "dark:bg-gray-700"], [1, "sr-only"]],
      template: function AsideskeletonComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "h3", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "span", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Loading...");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        }
      },
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 7135:
/*!********************************************************************************!*\
  !*** ./src/app/shared/widgets/skeleton/cardskeleton/cardskeleton.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CardskeletonComponent": () => (/* binding */ CardskeletonComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 2560);

class CardskeletonComponent {
  static {
    this.ɵfac = function CardskeletonComponent_Factory(t) {
      return new (t || CardskeletonComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: CardskeletonComponent,
      selectors: [["app-cardskeleton"]],
      decls: 9,
      vars: 0,
      consts: [["role", "status", 1, "flex", "flex-row", "justify-between", "mx-auto", "md:flex-col", "w-full", "max-w-md", "max-w-sm", "p-4", "shadow", "animate-pulse", "md:p-6", "dark:border-gray-700"], [1, "flex", "items-center", "justify-center", "h-48", "w-full", "mb-4", "bg-gray-200", "dark:bg-gray-700"], [1, "flex", "flex-col", "items-center", "p-2"], [1, "h-2.5", "bg-gray-200", "dark:bg-gray-700", "w-32", "mb-2"], [1, "w-40", "h-8", "bg-gray-200", "dark:bg-gray-700"], [1, "sr-only"]],
      template: function CardskeletonComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2)(3, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "div", 3)(5, "div", 3)(6, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "span", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Loading...");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        }
      },
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 2859:
/*!***********************************************************************!*\
  !*** ./src/app/shared/widgets/skeleton/product/skeleton.component.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SkeletonComponent": () => (/* binding */ SkeletonComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 2560);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 4666);
/* harmony import */ var _cardskeleton_cardskeleton_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../cardskeleton/cardskeleton.component */ 7135);
/* harmony import */ var _asideskeleton_asideskeleton_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../asideskeleton/asideskeleton.component */ 7610);




function SkeletonComponent_app_asideskeleton_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "app-asideskeleton");
  }
}
function SkeletonComponent_app_cardskeleton_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "app-cardskeleton");
  }
}
class SkeletonComponent {
  constructor() {
    this.asideSkeletons = [...new Array(3)];
    this.prodSkeletons = [...new Array(12)];
  }
  static {
    this.ɵfac = function SkeletonComponent_Factory(t) {
      return new (t || SkeletonComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: SkeletonComponent,
      selectors: [["app-skeleton"]],
      decls: 8,
      vars: 2,
      consts: [[1, "grid", "grid-cols-1", "md:grid-cols-3", "lg:grid-cols-4", "mb-10", "bg-white", "mx-auto", "max-w-[1300px]"], [1, "col-span-1", "md:col-span-1", "lg:col-span-1", "mb-4", "fixed", "top-0", "right-0", "w-[350px]", "md:w-auto", "bg-[#f8f8f8]", "z-[98]", "h-full", "drop-shadow-lg", "md:drop-shadow-none", "md:static", "hidden", "md:block"], [1, "bg-white", "h-full", "p-3", "md:mr-6", "overflow-auto"], [4, "ngFor", "ngForOf"], [1, "col-span-1", "md:col-span-2", "lg:col-span-3"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "gap-4"]],
      template: function SkeletonComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "section", 0)(1, "aside", 1)(2, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, SkeletonComponent_app_asideskeleton_3_Template, 1, 0, "app-asideskeleton", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "article", 4)(5, "div")(6, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, SkeletonComponent_app_cardskeleton_7_Template, 1, 0, "app-cardskeleton", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.asideSkeletons);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.prodSkeletons);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _cardskeleton_cardskeleton_component__WEBPACK_IMPORTED_MODULE_0__.CardskeletonComponent, _asideskeleton_asideskeleton_component__WEBPACK_IMPORTED_MODULE_1__.AsideskeletonComponent],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 2340:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "environment": () => (/* binding */ environment)
/* harmony export */ });
const environment = {
  production: false,
  baseAPIURL: '/api/',
  loginEndpoint: 'login',
  productsEndpoint: 'all-products'
};

/***/ }),

/***/ 4431:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 4497);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 6747);


_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule).catch(err => console.error(err));

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(1211), __webpack_exec__(4431)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map