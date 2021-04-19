export class StatusModel {
    public id: number;
    public code: number;
    public name: string;
    public typeid: number;
    public description: string;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.code = data.code;
            this.name = data.name;
            this.typeid = data.typeid;
            this.description = data.description;
        }
    }
}