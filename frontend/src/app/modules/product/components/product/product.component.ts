import { Component, EventEmitter, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Params } from '@angular/router';
import { CategoryFilter, Product } from '../../model';
import { FilterService } from '../../services/filter.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styles: [],
})
export class ProductComponent implements OnInit, OnDestroy {
  cloneOfProducts: Product[] = [];
  products: Product[] = [];
  category = '';
  isLoading = false;
  isFilter=false;
  error!:string;
  subsFilterProducts!:Subscription;
  
  selectedFilter:{rating:BehaviorSubject<number|null>;categoryId:BehaviorSubject<number|null>}={
    rating:new BehaviorSubject<number|null>(null),
    categoryId:new BehaviorSubject<number|null>(null)
  }
  ratingList:boolean[]=[];
  pageSize = 25; // default to 25 as shown in mockup
  allItemsFiltered: Product[] = [];
  allItemsFilteredCount = 0;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.getProductsByCategory();
    this.handleFilter();
  }

  getProductsByCategory(): Product[] {
    this.isLoading = true;
    this.route.params.subscribe((data: Params) => {
      this.category = data['category'] || 'All Item Groups';
      this.ratingList=[false,false,false,false];
      this.resetFilter();
      this.productService.getByCategory(this.category).subscribe((data)=>{
        this.isLoading = false;
        this.products = data;
        this.cloneOfProducts=data;
        this.filterService.filterProduct(data);
      },
      (error)=>this.error=error.message
      );
      this.filterService.getProductTypeFilter(this.category);
    });

    return this.products;
  }
  handleFilter() {
    this.subsFilterProducts=this.filterService.filteredProducts.subscribe((data) => {
      this.allItemsFiltered = data || [];
      this.allItemsFilteredCount = this.allItemsFiltered.length;
      this.applyPagination();
    });
  }

  applyPagination(): void {
    this.products = this.allItemsFiltered.slice(0, this.pageSize);
  }

  setPageSize(size: number): void {
    this.pageSize = size;
    this.applyPagination();
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
  
  onFilter(value:boolean){
    this.isFilter=value;
    // Prevent the page behind the mobile filter drawer from scrolling
    document.body.style.overflow = value ? 'hidden' : '';
  }

  resetFilter(){
    this.selectedFilter.categoryId.next(null);
    this.selectedFilter.rating.next(null);
  }
  

  ngOnDestroy(): void {
    this.subsFilterProducts.unsubscribe();
    document.body.style.overflow = '';
  }
}
