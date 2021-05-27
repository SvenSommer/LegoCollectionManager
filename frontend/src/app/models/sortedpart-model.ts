export class SortedPartModel {
    public id: number;
    public identifiedpart_id: number;
    public sortedset_id: number;
    public detected : number;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.identifiedpart_id = data.identifiedpart_id;
            this.sortedset_id = data.sortedset_id;
            this.detected = data.detected;
        }
    }
}