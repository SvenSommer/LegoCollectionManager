export class SortedPartModel {
    public id: number;
    public identifiedpart_id: number;
    public expectedpart_id: number;
    public run_id: number;
    public detected : number;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.identifiedpart_id = data.identifiedpart_id;
            this.expectedpart_id = data.expectedpart_id;
            this.run_id = data.run_id;
            this.detected = data.detected;
        }
    }
}