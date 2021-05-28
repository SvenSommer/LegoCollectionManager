export class RunModel {
    public id: number;
    public no: number;
    public collection_id: number;
    public sorter_id: number;
    public imagefolder: string;
    public sortedsets: any;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.no = data.no;
            this.collection_id = data.collection_id;
            this.sorter_id = data.sorter_id;
            this.imagefolder = data.imagefolder;
            this.sortedsets = data.sortedsets;
        }
    }
}