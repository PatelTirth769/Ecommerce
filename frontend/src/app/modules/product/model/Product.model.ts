export interface WholesalePricingTier {
    minimum_quantity: number;
    maximum_quantity: number;
    unit?: string;
    price: number;
    discount_: number;
    active: number;
}

export interface PricingRuleSlabDetail {
    minQty: number;
    maxQty: number;
    price: number;
}

export interface Product {
    id:string|number;
    title:string;
    description: string;
    category: string;
    type: string;
    sizes?: string[];
    size?:string;
    images: string[];
    stock: string;
    price: number;
    prevprice:number;
    mrp?: number;
    pack_size?: string;
    shelf_life_in_days?: number;
    qty?:number;
    discount?:number;
    totalprice?:number;
    variant_of?: string;
    has_variants?: boolean;
    item_code?: string;
    wholesale_pricing_tiers?: WholesalePricingTier[];
    pricingRuleSlabs?: PricingRuleSlabDetail[];
    erpRemainingShelfLifeInDays?: number;
    published?: boolean;
    modified?: string | Date;
    stock_uom?: string;
    erpDiscountedPrice?: number;
    erpDiscountPct?: number;
    stockQty?: number;
    stockByWarehouse?: { warehouse: string; qty: number }[];
    rating: {
      rate: number;
      count: number;
    }
}
