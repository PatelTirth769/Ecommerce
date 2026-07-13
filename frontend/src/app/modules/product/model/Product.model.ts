
export interface Product {
    id:number;
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
    rating: {
      rate: number;
      count: number;
    }
}
