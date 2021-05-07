export class IdentifiedPartModel {
    public id: number;
    public run_id: number;
    public no : number;
    public color_id : number;
    public score : number;
    public identifier : string;
    public partimages : string;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.run_id = data.run_id;
            this.no = data.no;
            this.color_id = data.color_id;
            this.score = data.score;
            this.identifier = data.identifier;
            this.partimages = data.partimages;
        }
    }
}