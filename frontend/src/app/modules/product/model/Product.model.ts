
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
    qty?:number;
    discount?:number;
    totalprice?:number;
    item_code?: string;
    rating: {
      rate: number;
      count: number;
    }
}


