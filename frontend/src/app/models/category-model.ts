export class CategoryModel {
    public id: number;
    public category_id: number;
    public category_name : string;
    public parent_id : string;
    public created : string;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.category_id = data.category_id;
            this.category_name = data.category_name;
            this.parent_id = data.parent_id;
            this.created = data.created;
        }
    }
}