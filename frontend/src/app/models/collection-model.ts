export class CollectionModel {
    public id: string;
    public name: string;
    public weight_kg: string;
    public origin: string;
    public origin_url: string;
    public seller: string;
    public description: string;
    public purchase_date: string;
    public cost: number;
    public porto: string;
    public thumbnail_url: string;
    public status: any;

    constructor(data = null) {
        
        if (data) {
            
            this.id = data.id;
            this.name = data.name;
            this.weight_kg = data.weight_kg;
            this.origin = data.origin;
            this.origin_url = data.origin_url;
            this.seller = data.seller;
            this.description = data.description;
            this.purchase_date = data.purchase_date;
            this.cost = data.cost;
            this.porto = data.porto;
            this.thumbnail_url = data.thumbnail_url;
            this.status = data.status;
        }
    }
}