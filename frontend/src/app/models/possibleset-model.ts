export class PossiblesetModel {
    public id: number;
    public offer_id: number;
    public setno: number;
    public amount : number;
    public comments : string;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.offer_id = data.offer_id;
            this.setno = data.setno;
            this.amount = data.amount;
            this.comments = data.comments;
        }
    }
}