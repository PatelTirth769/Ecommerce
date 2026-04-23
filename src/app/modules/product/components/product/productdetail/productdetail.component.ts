import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../model';
import { CartService } from 'src/app/core/services/cart.service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { ItemRecord, WebsiteItem, WebsiteItemService } from 'src/app/core/services/website-item.service';

interface DetailRow {
  label: string;
  value: string;
}

interface OfferRow {
  title: string;
  subtitle: string;
}

interface ReviewRow {
  rating: number;
  title: string;
  comment: string;
  reviewer: string;
  date: string;
  timestamp: number;
}

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styles: [
  ]
})
export class ProductdetailComponent implements OnInit{
  isLoading=false;
  isErpDetail=false;
  selectedSize!:string;
  category='';
  cart:Product[]=[];
  relatedProductList:Product[]=[];
  ratingList:boolean[]=[];
  images:string[]=[];
  product:Product={
    id:0,
    title:'',
    description:'',
    category:'',
    type:'',
    sizes:[],
    images:[],
    stock:'',
    price:0,
    prevprice:0,
    rating:{rate:0,count:0}
  };
  imageSrc='';
  selectedImage=0;
  discount=0;
  title:string='';
  detailRows: DetailRow[]=[];
  erpUom = '';
  erpOffers: OfferRow[] = [];
  erpLongDescription = '';
  erpReviews: ReviewRow[] = [];
  erpAverageRating = 0;
  erpRatingCounts = [0, 0, 0, 0, 0];
  erpStars = [1, 2, 3, 4, 5];
  private fallbackImage = 'assets/images/logo.png';

  constructor(
    private route:ActivatedRoute,
    private productService:ProductService,
    private cartService:CartService,
    private websiteItemService: WebsiteItemService,
    private router:Router
  ){}

  ngOnInit(): void {
    this.loadProduct(this.route.snapshot.params['id']);
    this.cart=this.cartService.getCart;
    this.route.params.subscribe(()=>{
      this.loadProduct(this.route.snapshot.params['id']);
      this.scrollToTop();
    })
  }

  loadProduct(identifier: string){
    this.isLoading=true;
    this.detailRows=[];
    this.erpUom='';
    this.erpOffers=[];
    this.erpLongDescription='';
    this.erpReviews=[];
    this.erpAverageRating=0;
    this.erpRatingCounts=[0, 0, 0, 0, 0];

    if (/^\d+$/.test(String(identifier))) {
      this.loadLegacyProduct(Number(identifier));
      return;
    }

    this.loadErpProduct(String(identifier));
  }

  private loadLegacyProduct(id: number): void {
    this.isErpDetail = false;
    this.productService.getProduct(id).subscribe((data: Product) => {
      this.isLoading = false;
      this.product = data;
      this.images = data.images || [];
      this.imageSrc = this.images[0] || this.fallbackImage;
      this.category = data.category;
      this.title = data.title;
      this.discount = this.product && this.product.prevprice !== 0 ? Math.round(100 - (this.product.price / this.product.prevprice) * 100) : 0;
      this.getRatingStar();
      this.relatedProducts();
    });
  }

  private loadErpProduct(identifier: string): void {
    this.isErpDetail = true;

    this.websiteItemService.resolveWebsiteItem(identifier).pipe(
      switchMap((websiteItem: WebsiteItem) => {
        console.log('🔍 WebsiteItem fetched from API:', websiteItem);
        const itemCode = websiteItem.item_code || websiteItem.item_name || websiteItem.name;
        const reviews$ = this.websiteItemService.getWebsiteItemReviews(websiteItem).pipe(
          catchError(() => of([] as Record<string, unknown>[]))
        );

        if (!itemCode) {
          return reviews$.pipe(map((reviews) => ({ websiteItem, item: null as ItemRecord | null, reviews, sellingPrice: 0 })));
        }

        return forkJoin({
          item: this.websiteItemService.getItem(itemCode).pipe(catchError(() => of(null as ItemRecord | null))),
          sellingPrice: this.websiteItemService.getItemSellingPrice(itemCode, websiteItem.item_name).pipe(catchError(() => of(0))),
          reviews: reviews$
        }).pipe(
          map(({ item, reviews, sellingPrice }) => {
            console.log('🔍 Item fetched from API:', item);
            return { websiteItem, item, reviews, sellingPrice };
          })
        );
      }),
      catchError((error) => {
        console.error('Error fetching ERPNext product:', error);
        return of(null);
      })
    ).subscribe((result) => {
      if (!result) {
        this.isLoading = false;
        return;
      }

      console.log('✅ Raw API Result:', result);

      this.product = this.toErpProduct(result.websiteItem, result.item, result.sellingPrice);
      this.images = this.product.images;
      this.imageSrc = this.images[0] || this.fallbackImage;
      this.category = this.product.category;
      this.title = this.product.title;
      this.discount = 0;
      this.ratingList = [];
      this.detailRows = this.buildDetailRows(result.websiteItem, result.item);
      this.erpUom = this.resolveErpUom(result.websiteItem, result.item);
      this.erpOffers = this.extractErpOffers(result.websiteItem, result.item);
      this.erpLongDescription = this.resolveErpLongDescription(result.websiteItem, result.item);
      this.erpReviews = this.extractErpReviews(result.websiteItem, result.item, result.reviews);
      this.setErpReviewStats(this.erpReviews);
      this.relatedProductList = [];

      console.log('📋 Parsed Product:', this.product);
      console.log('📊 Detail Rows:', this.detailRows);
      console.log('🏷️ Offers:', this.erpOffers);
      console.log('📏 UOM:', this.erpUom);
      console.log('📝 Web Long Description:', this.erpLongDescription);
      console.log('🧾 ERP Review Docs:', result.reviews);
      console.log('⭐ ERP Reviews:', this.erpReviews);

      this.isLoading = false;
    });
  }

  private toErpProduct(websiteItem: WebsiteItem, item: ItemRecord | null, sellingPrice = 0): Product {
    const title = websiteItem.web_item_name || websiteItem.item_name || item?.item_name || item?.name || websiteItem.name;
    const description = websiteItem.description || item?.description || '';
    const images = [
      websiteItem.website_image,
      websiteItem.thumbnail,
      item?.image,
      item?.website_image,
      item?.thumbnail
    ].filter((value): value is string => Boolean(value)).map((value) => this.resolveImageUrl(value));

    return {
      id: 0,
      title,
      description,
      category: item?.item_group || 'ERPNext Item',
      type: websiteItem.item_code || item?.item_code || item?.name || websiteItem.name,
      sizes: [],
      images: images.length > 0 ? images : [this.fallbackImage],
      stock: item?.disabled ? 'Out of stock' : 'In stock',
      price: Number(item?.standard_rate ?? 0) || Number(sellingPrice ?? 0),
      prevprice: 0,
      rating: {
        rate: 0,
        count: 0
      }
    };
  }

  private buildDetailRows(websiteItem: WebsiteItem, item: ItemRecord | null): DetailRow[] {
    const specificationRows = this.extractSpecificationRows(websiteItem, item);
    if (specificationRows.length > 0) {
      return specificationRows;
    }

    const rows: DetailRow[] = [
      { label: 'To Be Consumed', value: this.resolveShelfLife(websiteItem, item) || 'Not specified' },
      { label: 'Color', value: this.findFirstString(websiteItem, item, ['color', 'item_color', 'colour']) || 'Not specified' },
      { label: 'Packing', value: this.findFirstString(websiteItem, item, ['packing', 'pack_size', 'package', 'package_type']) || 'Not specified' },
      { label: 'Brand', value: this.findFirstString(websiteItem, item, ['brand']) || 'Not specified' },
      { label: 'UOM', value: this.resolveErpUom(websiteItem, item) || 'Nos' }
    ];

    return rows;
  }

  private extractSpecificationRows(websiteItem: WebsiteItem, item: ItemRecord | null): DetailRow[] {
    const rows: DetailRow[] = [];
    const seen = new Set<string>();

    const sources: unknown[] = [websiteItem, item];
    for (const source of sources) {
      const records = this.readArray(source, ['website_specifications', 'specifications', 'product_details', 'details', 'attributes']);
      records.forEach((entry) => {
        const label = this.getRecordValue(entry, ['label', 'attribute', 'title', 'name', 'specification', 'key']);
        const value = this.getRecordValue(entry, ['description', 'value', 'attribute_value', 'content', 'text']);
        if (!label || !value) {
          return;
        }

        const dedupeKey = `${label.toLowerCase()}::${value.toLowerCase()}`;
        if (!seen.has(dedupeKey)) {
          seen.add(dedupeKey);
          rows.push({ label, value });
        }
      });
    }

    return rows;
  }

  private readArray(source: unknown, keys: string[]): unknown[] {
    for (const key of keys) {
      const candidate = this.readRecord(source)[key];
      if (Array.isArray(candidate)) {
        return candidate;
      }
    }

    return [];
  }

  private findFirstString(websiteItem: WebsiteItem, item: ItemRecord | null, keys: string[]): string {
    const sources: unknown[] = [websiteItem, item];
    for (const source of sources) {
      const record = this.readRecord(source);
      for (const key of keys) {
        const value = record[key];
        if (typeof value === 'string' && value.trim().length > 0) {
          return this.normalizeDetailValue(value);
        }
      }
    }

    return '';
  }

  private resolveShelfLife(websiteItem: WebsiteItem, item: ItemRecord | null): string {
    const sources: unknown[] = [websiteItem, item];
    const keys = ['to_be_consumed', 'shelf_life', 'shelf_life_in_days', 'expiry_in_days'];

    for (const source of sources) {
      const record = this.readRecord(source);
      for (const key of keys) {
        const value = record[key];
        if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
          return `Within ${value} days`;
        }

        if (typeof value === 'string' && value.trim().length > 0) {
          const normalized = this.normalizeDetailValue(value);
          return /^\d+$/.test(normalized) ? `Within ${normalized} days` : normalized;
        }
      }
    }

    return '';
  }

  private resolveErpUom(websiteItem: WebsiteItem, item: ItemRecord | null): string {
    const uom = this.findFirstString(websiteItem, item, ['uom', 'stock_uom', 'sales_uom']);
    return uom || 'Nos';
  }

  private resolveErpLongDescription(websiteItem: WebsiteItem, item: ItemRecord | null): string {
    const longDescription = websiteItem.web_long_description || websiteItem.description || item?.description || '';
    return this.normalizeDetailValue(longDescription);
  }

  private extractErpOffers(websiteItem: WebsiteItem, item: ItemRecord | null): OfferRow[] {
    const sources: unknown[] = [websiteItem, item];
    const keys = ['offers_to_display', 'offers', 'offer_details'];
    const values: OfferRow[] = [];

    for (const source of sources) {
      const record = this.readRecord(source);

      for (const key of keys) {
        const rawOffers = record[key];
        if (!Array.isArray(rawOffers)) {
          continue;
        }

        rawOffers.forEach((entry) => {
          if (typeof entry === 'string') {
            const parsed = this.parseOfferText(entry);
            if (parsed) {
              values.push(parsed);
            }
            return;
          }

          const title = this.getRecordValue(entry, ['offer_title', 'title', 'label', 'name', 'heading']);
          const subtitle = this.getRecordValue(entry, ['offer_subtitle', 'subtitle', 'description', 'value', 'text']);
          const parsed = this.toOfferRow(title, subtitle);
          if (parsed) {
            values.push(parsed);
          }
        });
      }
    }

    return values.filter((item) => item.title.trim().length > 0 || item.subtitle.trim().length > 0);
  }

  private extractErpReviews(websiteItem: WebsiteItem, item: ItemRecord | null, reviewDocs: Record<string, unknown>[]): ReviewRow[] {
    const sources: unknown[] = [websiteItem, item];
    const keys = ['website_reviews', 'item_reviews', 'reviews', 'customer_reviews', 'ratings'];
    const rows: ReviewRow[] = [];
    const seen = new Set<string>();

    reviewDocs.forEach((doc) => {
      const review = this.toReviewRow(doc);
      if (!review) {
        return;
      }

      const dedupeKey = `${review.rating}|${review.title}|${review.comment}|${review.reviewer}|${review.date}`.toLowerCase();
      if (!seen.has(dedupeKey)) {
        seen.add(dedupeKey);
        rows.push(review);
      }
    });

    for (const source of sources) {
      const record = this.readRecord(source);

      for (const key of keys) {
        const rawReviews = record[key];
        if (!Array.isArray(rawReviews)) {
          continue;
        }

        rawReviews.forEach((entry) => {
          const review = this.toReviewRow(entry);
          if (!review) {
            return;
          }

          const dedupeKey = `${review.rating}|${review.title}|${review.comment}|${review.reviewer}|${review.date}`.toLowerCase();
          if (seen.has(dedupeKey)) {
            return;
          }

          seen.add(dedupeKey);
          rows.push(review);
        });
      }
    }

    return rows.sort((a, b) => b.timestamp - a.timestamp);
  }

  private toReviewRow(source: unknown): ReviewRow | null {
    if (typeof source === 'string') {
      const commentOnly = this.normalizeDetailValue(source);
      if (!commentOnly) {
        return null;
      }

      return {
        rating: 0,
        title: '',
        comment: commentOnly,
        reviewer: 'Anonymous',
        date: '',
        timestamp: 0
      };
    }

    console.log('📌 Parsing review row from source:', source);
    
    // Log all numeric fields for debugging
    const record = this.readRecord(source);
    const numericFields = Object.entries(record)
      .filter(([_, val]) => typeof val === 'number')
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');
    if (numericFields) {
      console.log(`🔢 All numeric fields: ${numericFields}`);
    }

    const ratingValue = this.getRecordValue(source, ['rating', 'stars', 'rating_value', 'score', 'item_rating', 'item_reviewed_rating', 'review_rating', 'star_rating']);
    let rating = this.parseReviewRating(ratingValue);
    
    // If rating is still 0 or 1, check if there's a numeric value in the source directly
    if (rating <= 1) {
      for (const key of ['rating', 'stars', 'rating_value', 'score']) {
        const val = record[key];
        if (typeof val === 'number' && val > 1 && val <= 5) {
          console.log(`✓ Found rating ${val} in field: ${key}`);
          rating = Math.round(val);
          break;
        }
      }
    }
    
    console.log(`⭐ Final parsed rating: ${rating}`);
    
    const title = this.getRecordValue(source, ['review_title', 'title', 'subject', 'heading']);
    const comment = this.getRecordValue(source, ['review_description', 'review', 'comment', 'message', 'description', 'content']);
    const reviewer = this.getRecordValue(source, ['customer_name', 'customer', 'reviewer', 'full_name', 'owner', 'name']) || 'Anonymous';
    const rawDate = this.getRecordValue(source, ['review_date', 'date', 'creation', 'modified', 'posted_on', 'published_on']);
    const { formatted, timestamp } = this.formatReviewDate(rawDate);

    if (!rating && !title && !comment) {
      return null;
    }

    return {
      rating,
      title,
      comment,
      reviewer,
      date: formatted,
      timestamp
    };
  }

  private parseReviewRating(value: string): number {
    if (!value) {
      console.log('⚠️ Rating value is empty');
      return 0;
    }

    const match = value.match(/\d+(\.\d+)?/);
    if (!match) {
      console.log(`⚠️ No numeric match found in rating value: "${value}"`);
      return 0;
    }

    const parsed = Number(match[0]);
    if (!Number.isFinite(parsed)) {
      console.log(`⚠️ Parsed rating is not finite: ${parsed}`);
      return 0;
    }

    const normalized = Math.round(parsed);
    const clamped = Math.max(0, Math.min(5, normalized));

    if (parsed === 0) {
      console.log(`📊 Rating pipeline: "${value}" → parsed: ${parsed} → display: 0`);
      return 0;
    }

    if (parsed > 0 && parsed <= 1) {
      const displayRating = Math.max(1, Math.min(5, Math.round(parsed * 5)));
      console.log(`📊 Rating pipeline: "${value}" → parsed: ${parsed} → normalized from fraction to 5-star scale: ${displayRating}`);
      return displayRating;
    }

    const displayRating = clamped;
    console.log(`📊 Rating pipeline: "${value}" → parsed: ${parsed} → rounded: ${normalized} → clamped: ${clamped} → display: ${displayRating}`);
    return displayRating;
  }

  private formatReviewDate(value: string): { formatted: string; timestamp: number } {
    if (!value) {
      return { formatted: '', timestamp: 0 };
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return { formatted: value, timestamp: 0 };
    }

    return {
      formatted: parsedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      timestamp: parsedDate.getTime()
    };
  }

  private setErpReviewStats(reviews: ReviewRow[]): void {
    this.erpRatingCounts = [0, 0, 0, 0, 0];

    let total = 0;
    let ratedCount = 0;

    reviews.forEach((review) => {
      if (review.rating <= 0) {
        return;
      }

      total += review.rating;
      ratedCount += 1;
      this.erpRatingCounts[review.rating - 1] += 1;
    });

    this.erpAverageRating = ratedCount > 0 ? total / ratedCount : 0;
  }

  getErpRatedCount(): number {
    return this.erpRatingCounts.reduce((sum, count) => sum + count, 0);
  }

  getErpStarPercentage(star: number): number {
    const ratedCount = this.getErpRatedCount();
    if (ratedCount === 0) {
      return 0;
    }

    return (this.erpRatingCounts[star - 1] / ratedCount) * 100;
  }

  isAverageStarFilled(star: number): boolean {
    return star <= Math.round(this.erpAverageRating);
  }

  private parseOfferText(value: string): OfferRow | null {
    const normalized = this.normalizeDetailValue(value);
    if (!normalized) {
      return null;
    }

    const parts = normalized.split(':');
    if (parts.length >= 2) {
      return this.toOfferRow(parts.shift() || '', parts.join(':'));
    }

    return this.toOfferRow('', normalized);
  }

  private toOfferRow(title: string, subtitle: string): OfferRow | null {
    const normalizedTitle = this.normalizeDetailValue(title);
    const normalizedSubtitle = this.normalizeDetailValue(subtitle);

    if (!normalizedTitle && !normalizedSubtitle) {
      return null;
    }

    return {
      title: normalizedTitle,
      subtitle: normalizedSubtitle
    };
  }

  private getRecordValue(source: unknown, keys: string[]): string {
    const record = this.readRecord(source);
    for (const key of keys) {
      const value = record[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        return String(value);
      }

      if (typeof value === 'string' && value.trim().length > 0) {
        return this.normalizeDetailValue(value);
      }
    }

    return '';
  }

  private normalizeDetailValue(value: string): string {
    if (!value) {
      return '';
    }

    const decoded = this.decodeHtmlEntities(value)
      .replace(/<\s*br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n');

    const parserNode = document.createElement('div');
    parserNode.innerHTML = decoded;

    return (parserNode.textContent || parserNode.innerText || '')
      .replace(/\s*\n\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private decodeHtmlEntities(value: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = value;
    return txt.value;
  }

  private readRecord(source: unknown): Record<string, unknown> {
    if (source && typeof source === 'object') {
      return source as Record<string, unknown>;
    }

    return {};
  }

  private resolveImageUrl(value: string): string {
    return this.websiteItemService.resolveImageUrl(value);
  }
  
  scrollToTop(){
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
  }

  getRatingStar(){
    this.ratingList=this.productService.getRatingStar(this.product);
  }
  addToCart(product:Product){
    this.cartService.add(product);
    this.cart = this.cartService.getCart;
  }
  removeFromCart(product:Product){
    this.cartService.remove(product);
    this.cart = this.cartService.getCart;
  }
  isProductInCart(product:Product){
    return this.cart.some(item => this.getCartKey(item) === this.getCartKey(product));
  }

  private getCartKey(product: Product): string {
    return String(product.item_code || product.type || product.id || product.title || '').trim().toLowerCase();
  }

  relatedProducts(){
    this.isLoading=true;
   this.productService.getRelated(this.product.type).subscribe(data=>{
    this.relatedProductList=data.filter((item:Product)=>{
    this.isLoading=false;
     return this.product.id!==item.id
    });
    });
  }

  addSize(value:string,index:string){
    this.selectedSize=index;
    this.product.size=value;
  }
  onImage(value:string,index:number){
    this.imageSrc=value;
    this.selectedImage=index;
  }
  
}
