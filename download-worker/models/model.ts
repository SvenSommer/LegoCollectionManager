export type PriceType = 'PART' | 'MINIFIG' | 'GEAR' | 'SET';
export type GuideType = 'stock' | 'sold'
export type NewOrUsed = 'U' |'N'

export interface PriceParams {
    partnumber: string;
    type: PriceType;
    priceinfo: PriceInfo; // TODO meh
    colorid: number;
    region: string;
    guide_type: GuideType // TODO declare type
}

export interface PriceInfo {
    new_or_used : NewOrUsed;
    currency_code : string;
    min_price : number;
    max_price : number;
    avg_price : number;
    qty_avg_price : number;
    unit_quantity : number;
    total_quantity : number;

}