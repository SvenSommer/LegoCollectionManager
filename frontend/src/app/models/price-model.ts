export class PriceModel {
    public id: number;
    public no: number;
    public type : string;
    public new_or_used : string;
    public color_id : number;
    public region : string;
    public guide_type : string;
    public currency_code : string;
    public min_price : number;
    public max_price : number;
    public avg_price : number;
    public qty_avg_price : number;
    public unit_quantity : number;
    public total_quantity : number;
    public created : string;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.no = data.no;
            this.type = data.type;
            this.new_or_used = data.new_or_used;
            this.color_id = data.color_id;
            this.region = data.region;
            this.guide_type = data.guide_type;
            this.currency_code = data.currency_code;
            this.min_price = data.min_price;
            this.max_price = data.max_price;
            this.avg_price = data.avg_price;
            this.qty_avg_price = data.qty_avg_price;
            this.unit_quantity = data.unit_quantity;
            this.total_quantity = data.total_quantity;
            this.created = data.created;
        }
    }
}