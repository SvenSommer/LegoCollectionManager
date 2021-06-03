export class SortedSetModel {
    public id: number;
    public run_id: number;
    public setno: number;
    public expectedset_id: number;
    public pusher_id : number;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.run_id = data.run_id;
            this.setno = data.setno;
            this.expectedset_id = data.expectedset_id;
            this.pusher_id = data.pusher_id;
        }
    }
}