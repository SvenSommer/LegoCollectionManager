export class SortedSetModel {
    public id: number;
    public run_id: number;
    public recognisedset_id: number;
    public pusher_id : number;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.run_id = data.run_id;
            this.recognisedset_id = data.recognisedset_id;
            this.pusher_id = data.pusher_id;
        }
    }
}