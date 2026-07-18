import { Component, EventEmitter, Input,OnDestroy,OnInit, Output, ViewChild } from '@angular/core';
import { CategoryFilter, Product } from '../../../model';
import {BehaviorSubject, Subscription } from 'rxjs';
import { FilterService } from '../../../services/filter.service';
import { WebsiteItemService } from '../../../../../core/services/website-item.service';
import { ProductService } from '../../../services/product.service';
import { PricefilterComponent } from './pricefilter/pricefilter.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styles: [
  ]
})
export class FilterComponent implements OnInit,OnDestroy{
  @Input() products!:Product[];
  @Input() category!:string;
  @Output() onFilter= new EventEmitter<boolean>();
  @Input() ratingList!:boolean[];
  filterCategories:CategoryFilter[]=[];
  @Input() selectedFilter!:{rating:BehaviorSubject<number|null>,categoryId:BehaviorSubject<number|null>};
  // filteredProducts=new Subject<Product[]>();
  selectedRating!:number|null;
  selectedCategory!:number|null;
  filteredProducts:Product[]=[];
  cloneOfProducts!:Product[];
  subsFilterList!:Subscription;
  itemGroups: string[] = [];
  subsItemGroups!: Subscription;
  allProductsForCount: Product[] = [];

  @ViewChild(PricefilterComponent) priceFilterComponent!: PricefilterComponent;
  localSelectedRating: number | null = null;

  constructor(
    private filterService:FilterService,
    private websiteItemService: WebsiteItemService,
    private productService: ProductService
  ){}

  ngOnInit(): void {
    this.loadCategoryFilters();
    this.loadItemGroups();
    this.loadAllProductsForCount();
  }

  loadAllProductsForCount(): void {
    this.productService.get.subscribe((products) => {
      this.allProductsForCount = products;
    });
  }

  getCategoryCount(group: string): number {
    if (!this.allProductsForCount || this.allProductsForCount.length === 0) return 0;
    if (group === 'All Item Groups') {
      return this.allProductsForCount.length;
    }
    const normalizedGroup = group.toLowerCase().trim();
    return this.allProductsForCount.filter(p => (p.category || '').toLowerCase().trim() === normalizedGroup).length;
  }

  loadItemGroups(): void {
    this.subsItemGroups = this.websiteItemService.getItemGroups().subscribe((groups: any[]) => {
      const rawGroups: string[] = groups.map((g: any) => String(g.name || g.item_group_name || '')).filter((name: string) => !!name);
      
      let uniqueGroups: string[] = Array.from(new Set(rawGroups));
      if (!uniqueGroups.includes('All Item Groups')) {
        uniqueGroups.unshift('All Item Groups');
      } else {
        uniqueGroups = uniqueGroups.filter((g: string) => g !== 'All Item Groups');
        uniqueGroups.unshift('All Item Groups');
      }
      
      this.itemGroups = uniqueGroups;
    });
  }

  loadCategoryFilters(){
    this.subsFilterList=this.filterService.filterList.subscribe(data=>this.filterCategories=data.slice());
    this.initFilterValues();
  }

  toggleCategoryCheckbox(categoryItem: CategoryFilter) {
    categoryItem.checked = !categoryItem.checked;
  }

  selectRating(rating: number) {
    this.localSelectedRating = rating;
    this.ratingList = this.ratingList.map((rate, i) => rating >= i + 1 ? true : false);
  }

  applyFilters() {
    const minPrice = this.priceFilterComponent ? this.priceFilterComponent.minVal : 0;
    const maxPrice = this.priceFilterComponent ? this.priceFilterComponent.maxVal : 10000;
    const checkedTypes = this.filterCategories.filter(c => c.checked).map(c => String(c.value));
    
    this.filterService.applyUnifiedFilter(minPrice, maxPrice, this.localSelectedRating, checkedTypes);
    this.onClose();
  }

  clearFilters() {
    if (this.priceFilterComponent) {
      this.priceFilterComponent.reset();
    }
    this.filterCategories.forEach(c => c.checked = false);
    this.localSelectedRating = null;
    this.ratingList = [false, false, false, false];
    
    this.filterService.applyUnifiedFilter(0, 10000, null, []);
  }

  initFilterValues(){
    this.selectedFilter.rating.subscribe(value=>this.selectedRating=value);
    this.selectedFilter.categoryId.subscribe(value=>this.selectedCategory=value);
  }

  onClose(){
    this.onFilter.emit(false);
  }
  unsubscribeSubject(){
    this.subsFilterList.unsubscribe();
  }
  ngOnDestroy(): void {
    this.unsubscribeSubject();
    if (this.subsItemGroups) {
      this.subsItemGroups.unsubscribe();
    }
  }
 
}
