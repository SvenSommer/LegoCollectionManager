export class TypeModel {
    public id: number;
    public name: string;
    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
        }
    }
}