export class PurchasedPartModel {
    public id: number;
    public orderitem_id: number;
    public expectedpart_id : number;
    public quantity : number;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.orderitem_id = data.orderitem_id;
            this.expectedpart_id = data.expectedpart_id;
            this.quantity = data.quantity;
        }
    }
}