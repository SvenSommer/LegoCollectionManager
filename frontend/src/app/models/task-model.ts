export class TaskModel {
    public type_id: number;
    public origin: string;
    public information: string;

    constructor(data = null) {
        if (data) {
            this.type_id = data.type_id;
            this.origin = data.origin;
            this.information = data.information;
        }
    }
}